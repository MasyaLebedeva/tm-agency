"""
Multi-Bot Manager - Управление несколькими Telegram ботами в одном сервисе
Объединяет ROI калькулятор бот и Gigtest бот
"""
import os
import logging
import sqlite3
import io
# Импортируем psycopg2 только если нужен (во время выполнения, не во время сборки)
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    PSYCOPG2_AVAILABLE = True
except ImportError:
    PSYCOPG2_AVAILABLE = False
from datetime import datetime, timedelta
from aiogram import Bot, Dispatcher
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery, Update, BotCommand
from aiogram.dispatcher.middlewares import BaseMiddleware
import traceback
import asyncio
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiohttp import web, ClientSession
from dotenv import load_dotenv
from typing import Dict, Optional
from urllib.parse import parse_qs, urlparse

# Загружаем переменные окружения
load_dotenv()

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Версия кода для отладки
CODE_VERSION = "2025-11-22-v2-direct-api-calls"
logger.info(f"📦 Версия кода: {CODE_VERSION}")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEBHOOK_URL = os.getenv("WEBHOOK_URL", "").strip()

# Путь для хранения баз данных
# Сначала пробуем использовать Volume (если установлен DATA_DIR)
# Если нет - используем /app/data, если не получается - используем BASE_DIR
DATA_DIR = os.getenv("DATA_DIR", "/app/data")
if DATA_DIR != "/app/data" and os.path.exists(DATA_DIR):
    # Volume установлен
    logger.info(f"✅ Используется Volume для данных: {DATA_DIR}")
else:
    # Пробуем создать /app/data
    try:
        os.makedirs("/app/data", exist_ok=True)
        DATA_DIR = "/app/data"
        logger.info(f"✅ Используется директория для данных: {DATA_DIR}")
    except Exception as e:
        # Если не получается - используем BASE_DIR
        logger.warning(f"⚠️ Не удалось создать /app/data, используем {BASE_DIR}: {e}")
        DATA_DIR = BASE_DIR
        logger.info(f"✅ Используется BASE_DIR для данных: {DATA_DIR}")

# Функция для проверки использования PostgreSQL (вызывается во время выполнения)
def use_postgresql():
    """Проверяет, используется ли PostgreSQL"""
    database_url = os.getenv("DATABASE_URL", "")
    if database_url:
        logger.info(f"🔍 DATABASE_URL найден: {database_url[:30]}... (длина: {len(database_url)})")
        if database_url.startswith("postgres"):
            logger.info("✅ DATABASE_URL указывает на PostgreSQL")
            return True
        else:
            logger.warning(f"⚠️ DATABASE_URL не начинается с 'postgres': {database_url[:50]}")
    else:
        logger.warning("⚠️ DATABASE_URL не установлен в переменных окружения")
    return False

# Глобальная переменная для отслеживания первого подключения
_postgresql_logged = False

def get_db_connection(bot_name: str):
    """Получить подключение к базе данных (PostgreSQL или SQLite)"""
    global _postgresql_logged
    
    if use_postgresql() and PSYCOPG2_AVAILABLE:
        # Используем PostgreSQL
        if not _postgresql_logged:
            logger.info("✅ Используется PostgreSQL для хранения данных")
            _postgresql_logged = True
        database_url = os.getenv("DATABASE_URL", "")
        conn = psycopg2.connect(database_url)
        return conn
    else:
        # Используем SQLite
        if not _postgresql_logged:
            if use_postgresql() and not PSYCOPG2_AVAILABLE:
                logger.warning("⚠️ DATABASE_URL установлен, но psycopg2 не доступен. Используется SQLite.")
            else:
                logger.info("ℹ️ Используется SQLite для хранения данных")
            _postgresql_logged = True
        db_path = os.path.join(DATA_DIR, f'{bot_name.lower()}.db')
        conn = sqlite3.connect(db_path)
        return conn

def get_table_name(bot_name: str, table_type: str = "users"):
    """Получить имя таблицы для бота"""
    return f"{bot_name.lower()}_{table_type}"

def execute_sql(bot_name: str, query: str, params: tuple = None, fetch: bool = False):
    """Универсальная функция для выполнения SQL запросов (PostgreSQL или SQLite)"""
    conn = get_db_connection(bot_name)
    c = conn.cursor()
    
    # Заменяем ? на %s для PostgreSQL
    if use_postgresql() and params:
        query = query.replace('?', '%s')
    
    try:
        if params:
            c.execute(query, params)
        else:
            c.execute(query)
        
        if fetch:
            result = c.fetchall()
        else:
            result = None
        
        conn.commit()
        return result, c
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()


class BotConfig:
    """Конфигурация для одного бота"""
    def __init__(self, bot_name: str):
        self.bot_name = bot_name
        
        # Безопасное получение переменных окружения
        def safe_getenv(key: str, default: str = "") -> str:
            """Безопасное получение переменной окружения"""
            try:
                value = os.getenv(key, default)
                # Если значение похоже на путь к файлу, возвращаем пустую строку
                if value and (value.startswith('/') or value.startswith('./') or '\\' in value):
                    logger.warning(f"⚠️ {key} содержит путь к файлу, игнорирую: {value}")
                    return default
                return str(value).strip() if value else default
            except Exception as e:
                logger.warning(f"⚠️ Ошибка при получении {key}: {e}")
                return default
        
        self.token = safe_getenv(f"{bot_name}_TOKEN", "")
        self.channel_id = safe_getenv(f"{bot_name}_CHANNEL_ID", "")
        self.channel_link = safe_getenv(f"{bot_name}_CHANNEL_LINK", "")
        
        admin_ids_str = safe_getenv(f"{bot_name}_ADMIN_IDS", "")
        self.admin_ids = []
        if admin_ids_str:
            try:
                self.admin_ids = [int(id.strip()) for id in admin_ids_str.split(",") if id.strip().isdigit()]
            except Exception as e:
                logger.warning(f"⚠️ Ошибка при парсинге {bot_name}_ADMIN_IDS: {e}")
        
        # Для ROI бота
        self.google_sheets_link = safe_getenv(f"{bot_name}_GOOGLE_SHEETS_LINK", "")
        self.video_link = safe_getenv(f"{bot_name}_VIDEO_LINK", "")
        
        # Для Gigtest бота (Google документ)
        self.google_doc_link = safe_getenv(f"{bot_name}_GOOGLE_DOC_LINK", "")
        
        # Используем DATA_DIR для постоянного хранения (Volume в Railway)
        self.db_path = os.path.join(DATA_DIR, f'{bot_name.lower()}.db')
        
        if not self.token:
            logger.warning(f"⚠️ {bot_name}_TOKEN не установлен. Бот {bot_name} не будет запущен.")


class BotManager:
    """Менеджер для управления несколькими ботами"""
    
    def __init__(self):
        self.bots: Dict[str, Bot] = {}
        self.dispatchers: Dict[str, Dispatcher] = {}
        self.configs: Dict[str, BotConfig] = {}
        self.storages: Dict[str, MemoryStorage] = {}
        
    def register_bot(self, bot_name: str):
        """Регистрация бота"""
        config = BotConfig(bot_name)
        if not config.token:
            logger.warning(f"Пропускаю бота {bot_name} - токен не установлен")
            return False
            
        try:
            storage = MemoryStorage()
            bot = Bot(token=config.token)
            dp = Dispatcher(bot)
            dp.storage = storage
            
            self.bots[bot_name] = bot
            self.dispatchers[bot_name] = dp
            self.configs[bot_name] = config
            self.storages[bot_name] = storage
            
            # Инициализация БД для бота
            self.init_db(bot_name, config)
            
            # Регистрация обработчиков
            self.register_handlers(bot_name, dp, config)
            
            logger.info(f"✅ Бот {bot_name} успешно зарегистрирован")
            return True
        except Exception as e:
            logger.error(f"❌ Ошибка при регистрации бота {bot_name}: {e}")
            logger.error(f"Трассировка: {traceback.format_exc()}")
            return False
    
    def init_db(self, bot_name: str, config: BotConfig):
        """Инициализация БД для бота"""
        try:
            conn = get_db_connection(bot_name)
            c = conn.cursor()
            
            # Используем разные имена таблиц для каждого бота
            users_table = f"{bot_name.lower()}_users"
            stats_table = f"{bot_name.lower()}_stats"
            
            if use_postgresql():
                # PostgreSQL синтаксис
                c.execute(f'''CREATE TABLE IF NOT EXISTS {users_table}
                             (user_id BIGINT PRIMARY KEY,
                              username TEXT,
                              first_name TEXT,
                              last_name TEXT,
                              language_code TEXT,
                              joined_at TIMESTAMP,
                              last_activity TIMESTAMP,
                              is_subscribed INTEGER DEFAULT 0,
                              source TEXT,
                              utm_source TEXT,
                              utm_medium TEXT,
                              utm_campaign TEXT,
                              referrer_id BIGINT,
                              referrals_count INTEGER DEFAULT 0)''')
                
                c.execute(f'''CREATE TABLE IF NOT EXISTS {stats_table}
                             (id SERIAL PRIMARY KEY,
                              user_id BIGINT,
                              action TEXT,
                              timestamp TIMESTAMP,
                              metadata TEXT,
                              FOREIGN KEY(user_id) REFERENCES {users_table}(user_id))''')
            else:
                # SQLite синтаксис
                c.execute(f'''CREATE TABLE IF NOT EXISTS {users_table}
                             (user_id INTEGER PRIMARY KEY,
                              username TEXT,
                              first_name TEXT,
                              last_name TEXT,
                              language_code TEXT,
                              joined_at TIMESTAMP,
                              last_activity TIMESTAMP,
                              is_subscribed INTEGER DEFAULT 0,
                              source TEXT,
                              utm_source TEXT,
                              utm_medium TEXT,
                              utm_campaign TEXT,
                              referrer_id INTEGER,
                              referrals_count INTEGER DEFAULT 0)''')
                
                c.execute(f'''CREATE TABLE IF NOT EXISTS {stats_table}
                             (id INTEGER PRIMARY KEY AUTOINCREMENT,
                              user_id INTEGER,
                              action TEXT,
                              timestamp TIMESTAMP,
                              metadata TEXT,
                              FOREIGN KEY(user_id) REFERENCES {users_table}(user_id))''')
            
            # Проверяем количество пользователей в базе
            c.execute(f'SELECT COUNT(*) FROM {users_table}')
            existing_users = c.fetchone()[0]
            
            conn.commit()
            conn.close()
            
            logger.info(f"✅ БД для {bot_name} инициализирована")
            logger.info(f"📊 Пользователей в базе {bot_name}: {existing_users}")
            
            if not use_postgresql():
                # Проверяем, существует ли файл базы данных (только для SQLite)
                if os.path.exists(config.db_path):
                    file_size = os.path.getsize(config.db_path)
                    logger.info(f"📁 Размер файла БД {bot_name}: {file_size} байт")
                else:
                    logger.warning(f"⚠️ Файл БД {bot_name} не существует: {config.db_path}")
        except Exception as e:
            logger.error(f"❌ Ошибка при инициализации БД для {bot_name}: {e}")
            logger.error(f"Трассировка: {traceback.format_exc()}")
    
    def register_handlers(self, bot_name: str, dp: Dispatcher, config: BotConfig):
        """Регистрация обработчиков для бота"""
        bot = self.bots[bot_name]
        
        # Middleware для логирования
        class LoggingMiddleware(BaseMiddleware):
            async def on_process_message(self, message: Message, data: dict):
                logger.info(f"[{bot_name}] Сообщение от {message.from_user.id}: {message.text}")
                return data
            
            async def on_process_callback_query(self, callback: CallbackQuery, data: dict):
                logger.info(f"[{bot_name}] 🔔 CALLBACK в middleware: data={callback.data}, user_id={callback.from_user.id}, callback_id={callback.id}")
                return data
        
        dp.middleware.setup(LoggingMiddleware())
        
        # Определяем тип бота по наличию ссылок
        is_roi_bot = bool(config.google_sheets_link or config.video_link)
        is_gigtest_bot = bool(config.google_doc_link)
        
        # Обработчик /start
        @dp.message_handler(commands=["start"])
        async def cmd_start(message: Message):
            user_id = message.from_user.id
            logger.info(f"[{bot_name}] 📨 Получена команда /start от пользователя {user_id}")
            # Устанавливаем текущий экземпляр бота в контекст
            Bot.set_current(bot)
            try:
                # Добавляем пользователя в БД
                conn = get_db_connection(bot_name)
                c = conn.cursor()
                users_table = get_table_name(bot_name, "users")
                
                if use_postgresql():
                    # PostgreSQL синтаксис
                    c.execute(f'''INSERT INTO {users_table} 
                                (user_id, username, first_name, last_name, language_code, joined_at, last_activity)
                                VALUES (%s, %s, %s, %s, %s, %s, %s)
                                ON CONFLICT (user_id) DO NOTHING''',
                             (user_id, message.from_user.username, message.from_user.first_name,
                              message.from_user.last_name, message.from_user.language_code, datetime.now(), datetime.now()))
                    c.execute(f'UPDATE {users_table} SET last_activity = %s WHERE user_id = %s', (datetime.now(), user_id))
                else:
                    # SQLite синтаксис
                    c.execute(f'''INSERT OR IGNORE INTO {users_table} 
                                (user_id, username, first_name, last_name, language_code, joined_at, last_activity)
                                VALUES (?, ?, ?, ?, ?, ?, ?)''',
                             (user_id, message.from_user.username, message.from_user.first_name,
                              message.from_user.last_name, message.from_user.language_code, datetime.now(), datetime.now()))
                    c.execute(f'UPDATE {users_table} SET last_activity = ? WHERE user_id = ?', (datetime.now(), user_id))
                
                conn.commit()
                
                # Проверяем количество пользователей в базе
                c.execute(f'SELECT COUNT(*) FROM {users_table}')
                total_users = c.fetchone()[0]
                conn.close()
                
                logger.info(f"[{bot_name}] ✅ Пользователь {user_id} добавлен/обновлён в БД. Всего в базе: {total_users}")
                
                # Приветственное сообщение в зависимости от типа бота
                if is_gigtest_bot:
                    welcome_text = "👋 Привет! Чтобы получить ответы на Гигтесты, пожалуйста, подпишись на канал"
                else:
                    welcome_text = (
                        "👋 Привет! Я помогу тебе рассчитать стоимость и ROI маркетинговой кампании для твоего Telegram-канала.\n\n"
                        "📊 Получи бесплатный калькулятор ROI:\n"
                        "• Таблица для расчета всех расходов\n"
                        "• Автоматический расчет прибыльности\n"
                        "• Видео-инструкция по использованию\n\n"
                        "Чтобы получить доступ, подпишись на наш канал с полезными материалами по продвижению в Telegram!"
                    )
                
                markup = InlineKeyboardMarkup(inline_keyboard=[
                    [InlineKeyboardButton(text="📢 Подписаться на канал", url=config.channel_link)],
                    [InlineKeyboardButton(text="✅ Проверить подписку", callback_data="check_subscription")]
                ])
                
                logger.info(f"[{bot_name}] 📤 Отправка приветственного сообщения пользователю {user_id}")
                await bot.send_message(user_id, welcome_text, reply_markup=markup)
                logger.info(f"[{bot_name}] ✅ Приветственное сообщение отправлено пользователю {user_id}")
            except Exception as e:
                logger.error(f"[{bot_name}] ❌ Ошибка в /start: {e}")
                logger.error(f"Трассировка: {traceback.format_exc()}")
                try:
                    await bot.send_message(user_id, "❌ Произошла ошибка. Пожалуйста, попробуйте позже.")
                except:
                    pass
        
        # Обработчик проверки подписки
        @dp.callback_query_handler(lambda c: c.data == "check_subscription")
        async def process_subscription(callback: CallbackQuery):
            user_id = callback.from_user.id
            callback_id = callback.id
            logger.info(f"[{bot_name}] 🔍 CALLBACK ПОЛУЧЕН: check_subscription от пользователя {user_id}, callback_id={callback_id}")
            try:
                # Устанавливаем текущий экземпляр бота в контекст
                Bot.set_current(bot)
                logger.info(f"[{bot_name}] 📤 Отправляю ответ на callback...")
                await callback.answer("⏳ Проверяю подписку...")
                logger.info(f"[{bot_name}] ✅ Ответ на callback отправлен")
                
                if not config.channel_id:
                    logger.warning(f"[{bot_name}] ⚠️ CHANNEL_ID не настроен для {bot_name}")
                    await callback.answer("❌ Канал не настроен", show_alert=True)
                    return
                
                # Обновляем активность
                conn = get_db_connection(bot_name)
                c = conn.cursor()
                users_table = get_table_name(bot_name, "users")
                if use_postgresql():
                    c.execute(f'UPDATE {users_table} SET last_activity = %s WHERE user_id = %s', (datetime.now(), user_id))
                else:
                    c.execute(f'UPDATE {users_table} SET last_activity = ? WHERE user_id = ?', (datetime.now(), user_id))
                conn.commit()
                conn.close()
                
                logger.info(f"[{bot_name}] 🔍 Проверяю подписку пользователя {user_id} в канале {config.channel_id}")
                member = await bot.get_chat_member(config.channel_id, user_id)
                is_subscribed = member.status in ["member", "administrator", "creator"]
                logger.info(f"[{bot_name}] 📊 Статус подписки пользователя {user_id}: {member.status} -> подписан: {is_subscribed}")
                
                # Обновляем статус подписки в БД
                conn = get_db_connection(bot_name)
                c = conn.cursor()
                if use_postgresql():
                    c.execute(f'UPDATE {users_table} SET is_subscribed = %s WHERE user_id = %s',
                             (1 if is_subscribed else 0, user_id))
                else:
                    c.execute(f'UPDATE {users_table} SET is_subscribed = ? WHERE user_id = ?',
                             (1 if is_subscribed else 0, user_id))
                conn.commit()
                conn.close()
                
                if is_subscribed:
                    logger.info(f"[{bot_name}] ✅ Пользователь {user_id} подписан, отправляю материалы...")
                    await callback.answer("✅ Отлично! Отправляю материалы...")
                    
                    # Отправляем материалы в зависимости от типа бота
                    if is_gigtest_bot:
                        # Gigtest бот - отправляем Google документ
                        logger.info(f"[{bot_name}] 📤 Отправка материалов Gigtest бота пользователю {user_id}")
                        materials_text = (
                            "🎉 Спасибо за подписку. Держи файл с ответами на тесты: "
                        )
                        await bot.send_message(user_id, materials_text + config.google_doc_link)
                        logger.info(f"[{bot_name}] ✅ Материалы Gigtest бота отправлены пользователю {user_id}")
                    else:
                        # ROI бот - отправляем таблицу и видео
                        logger.info(f"[{bot_name}] 📤 Отправка материалов ROI бота пользователю {user_id}")
                        materials_text = (
                            "🎉 Спасибо за подписку!\n\n"
                            "📊 Вот твой калькулятор ROI для Telegram-канала:\n\n"
                            "📋 <b>Google Таблица:</b>\n"
                            "Нажми на кнопку ниже, чтобы создать свою копию таблицы.\n"
                            "✅ Google автоматически предложит создать копию!\n"
                            "Просто нажми \"Создать копию\" и работай со своими данными.\n"
                            "💡 Все расчеты выполняются автоматически - просто вставляй свои цифры!\n\n"
                        )
                        
                        buttons = []
                        if config.google_sheets_link:
                            materials_text += "🎥 <b>Видео-инструкция:</b>\nПосмотри видео, чтобы понять, как использовать калькулятор максимально эффективно!\n\n"
                            buttons.append([InlineKeyboardButton(text="📊 Открыть Google Таблицу", url=config.google_sheets_link)])
                        if config.video_link:
                            buttons.append([InlineKeyboardButton(text="🎥 Видео-инструкция", url=config.video_link)])
                        
                        markup = InlineKeyboardMarkup(inline_keyboard=buttons) if buttons else None
                        await bot.send_message(user_id, materials_text, reply_markup=markup, parse_mode='HTML')
                        
                        # Отправляем меню для ROI бота
                        from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
                        menu = ReplyKeyboardMarkup(
                            keyboard=[
                                [KeyboardButton(text="🎁 Реферальная программа"), KeyboardButton(text="💬 Задать вопрос")],
                                [KeyboardButton(text="🌐 Сайт агентства T&M")]
                            ],
                            resize_keyboard=True
                        )
                        await bot.send_message(user_id, "Выбери действие из меню:", reply_markup=menu)
                        logger.info(f"[{bot_name}] ✅ Материалы ROI бота отправлены пользователю {user_id}")
                else:
                    logger.info(f"[{bot_name}] ❌ Пользователь {user_id} не подписан на канал")
                    await callback.answer("❌ Подписка не найдена", show_alert=True)
                    markup = InlineKeyboardMarkup(inline_keyboard=[
                        [InlineKeyboardButton(text="📢 Подписаться на канал", url=config.channel_link)],
                        [InlineKeyboardButton(text="🔄 Проверить снова", callback_data="check_subscription")]
                    ])
                    await bot.send_message(user_id, "Подпишись на канал, чтобы получить материалы!", reply_markup=markup)
            except Exception as e:
                logger.error(f"[{bot_name}] ❌ Ошибка при проверке подписки для пользователя {user_id}: {e}")
                logger.error(f"Трассировка: {traceback.format_exc()}")
                try:
                    await callback.answer("❌ Ошибка при проверке", show_alert=True)
                except:
                    pass
        
        # Обработчик /admin (только для ROI бота или если есть admin_ids)
        if config.admin_ids:
            @dp.message_handler(commands=["admin"])
            async def cmd_admin(message: Message):
                Bot.set_current(bot)
                if message.from_user.id not in config.admin_ids:
                    await message.answer("⛔️ У вас нет доступа к админ-панели")
                    return
                
                # Простая статистика
                conn = get_db_connection(bot_name)
                c = conn.cursor()
                users_table = get_table_name(bot_name, "users")
                c.execute(f'SELECT COUNT(*) FROM {users_table}')
                total = c.fetchone()[0]
                c.execute(f'SELECT COUNT(*) FROM {users_table} WHERE is_subscribed = 1')
                subscribed = c.fetchone()[0]
                if use_postgresql():
                    c.execute(f"SELECT COUNT(*) FROM {users_table} WHERE last_activity > NOW() - INTERVAL '1 day'")
                else:
                    c.execute(f"SELECT COUNT(*) FROM {users_table} WHERE last_activity > datetime('now','-1 day')")
                active = c.fetchone()[0]
                conn.close()
                
                # Кнопки админ-панели
                admin_markup = InlineKeyboardMarkup(inline_keyboard=[
                    [InlineKeyboardButton(text="👥 Пользователи", callback_data=f"admin_users_{bot_name}")],
                    [InlineKeyboardButton(text="📥 Экспорт базы", callback_data=f"admin_export_{bot_name}")],
                    [InlineKeyboardButton(text="📊 Статистика", callback_data=f"admin_stats_{bot_name}")]
                ])
                
                await message.answer(
                    f"👋 Админ-панель [{bot_name}]\n\n"
                    f"📈 Статистика:\n"
                    f"👥 Всего пользователей: {total}\n"
                    f"✅ Подписано: {subscribed}\n"
                    f"🟢 Активных за сутки: {active}\n\n"
                    f"Выбери действие:",
                    reply_markup=admin_markup
                )
            
            # Обработчик просмотра пользователей
            @dp.callback_query_handler(lambda c: c.data and c.data.startswith(f"admin_users_{bot_name}"))
            async def admin_users(callback: CallbackQuery):
                Bot.set_current(bot)
                if callback.from_user.id not in config.admin_ids:
                    await callback.answer("⛔️ Нет доступа", show_alert=True)
                    return
                
                await callback.answer("⏳ Загружаю пользователей...")
                
                conn = get_db_connection(bot_name)
                c = conn.cursor()
                users_table = get_table_name(bot_name, "users")
                c.execute(f'SELECT user_id, username, first_name, is_subscribed, joined_at FROM {users_table} ORDER BY joined_at DESC LIMIT 50')
                users = c.fetchall()
                conn.close()
                
                if not users:
                    await callback.message.answer("📭 Пользователей пока нет")
                    return
                
                text = f"👥 Пользователи [{bot_name}] (показано {len(users)} из последних 50):\n\n"
                for user_id, username, first_name, is_subscribed, joined_at in users:
                    status = "✅" if is_subscribed else "❌"
                    username_str = f"@{username}" if username else "без username"
                    name_str = first_name or "без имени"
                    text += f"{status} {name_str} ({username_str})\nID: {user_id}\nДата: {joined_at}\n\n"
                
                # Разбиваем на части, если слишком длинное
                if len(text) > 4000:
                    parts = [text[i:i+4000] for i in range(0, len(text), 4000)]
                    for part in parts:
                        await callback.message.answer(part)
                else:
                    await callback.message.answer(text)
            
            # Обработчик экспорта базы данных
            @dp.callback_query_handler(lambda c: c.data and c.data.startswith(f"admin_export_{bot_name}"))
            async def admin_export(callback: CallbackQuery):
                Bot.set_current(bot)
                if callback.from_user.id not in config.admin_ids:
                    await callback.answer("⛔️ Нет доступа", show_alert=True)
                    return
                
                await callback.answer("⏳ Формирую экспорт...")
                
                conn = get_db_connection(bot_name)
                c = conn.cursor()
                users_table = get_table_name(bot_name, "users")
                c.execute(f'SELECT * FROM {users_table}')
                users = c.fetchall()
                conn.close()
                
                if not users:
                    await callback.message.answer("📭 База данных пуста")
                    return
                
                # Формируем CSV
                csv_data = "user_id,username,first_name,last_name,language_code,joined_at,last_activity,is_subscribed,source,utm_source,utm_medium,utm_campaign,referrer_id,referrals_count\n"
                for user in users:
                    csv_data += ",".join([str(x) if x is not None else "" for x in user]) + "\n"
                
                # Отправляем как файл
                csv_file = io.BytesIO(csv_data.encode('utf-8'))
                csv_file.name = f"users_{bot_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
                
                await bot.send_document(callback.from_user.id, csv_file, caption=f"📥 Экспорт базы данных [{bot_name}]\nВсего пользователей: {len(users)}")
            
            # Обработчик статистики
            @dp.callback_query_handler(lambda c: c.data and c.data.startswith(f"admin_stats_{bot_name}"))
            async def admin_stats(callback: CallbackQuery):
                Bot.set_current(bot)
                if callback.from_user.id not in config.admin_ids:
                    await callback.answer("⛔️ Нет доступа", show_alert=True)
                    return
                
                await callback.answer("⏳ Загружаю статистику...")
                
                conn = get_db_connection(bot_name)
                c = conn.cursor()
                users_table = get_table_name(bot_name, "users")
                c.execute(f'SELECT COUNT(*) FROM {users_table}')
                total = c.fetchone()[0]
                c.execute(f'SELECT COUNT(*) FROM {users_table} WHERE is_subscribed = 1')
                subscribed = c.fetchone()[0]
                if use_postgresql():
                    c.execute(f"SELECT COUNT(*) FROM {users_table} WHERE last_activity > NOW() - INTERVAL '1 day'")
                    active_24h = c.fetchone()[0]
                    c.execute(f"SELECT COUNT(*) FROM {users_table} WHERE last_activity > NOW() - INTERVAL '7 days'")
                    active_7d = c.fetchone()[0]
                else:
                    c.execute(f"SELECT COUNT(*) FROM {users_table} WHERE last_activity > datetime('now','-1 day')")
                    active_24h = c.fetchone()[0]
                    c.execute(f"SELECT COUNT(*) FROM {users_table} WHERE last_activity > datetime('now','-7 days')")
                    active_7d = c.fetchone()[0]
                c.execute(f"SELECT COUNT(*) FROM {users_table} WHERE source IS NOT NULL AND source != ''")
                with_source = c.fetchone()[0]
                conn.close()
                
                await callback.message.answer(
                    f"📊 Статистика [{bot_name}]:\n\n"
                    f"👥 Всего пользователей: {total}\n"
                    f"✅ Подписано: {subscribed}\n"
                    f"🟢 Активных за 24ч: {active_24h}\n"
                    f"🟢 Активных за 7 дней: {active_7d}\n"
                    f"📊 С указанным источником: {with_source}"
                )
        
        # Обработчики кнопок меню для ROI бота
        if is_roi_bot:
            @dp.message_handler(lambda m: m.text == "🎁 Реферальная программа")
            async def handle_referrals_button(message: Message):
                Bot.set_current(bot)
                user_id = message.from_user.id
                conn = get_db_connection(bot_name)
                c = conn.cursor()
                users_table = get_table_name(bot_name, "users")
                if use_postgresql():
                    c.execute(f'SELECT referrals_count FROM {users_table} WHERE user_id = %s', (user_id,))
                else:
                    c.execute(f'SELECT referrals_count FROM {users_table} WHERE user_id = ?', (user_id,))
                result = c.fetchone()
                referrals_count = result[0] if result else 0
                conn.close()
                
                # Получаем username бота
                bot_info = await bot.get_me()
                bot_username = bot_info.username or "your_bot"
                referral_link = f"https://t.me/{bot_username}?start=ref{user_id}"
                
                await bot.send_message(
                    user_id,
                    f"🎁 <b>Реферальная программа</b>\n\n"
                    f"👥 Твои рефералы: {referrals_count}\n\n"
                    f"🔗 Твоя реферальная ссылка:\n{referral_link}\n\n"
                    f"💡 За каждого друга, который подпишется через твою ссылку, ты получишь бонус!",
                    parse_mode='HTML'
                )
            
            @dp.message_handler(lambda m: m.text == "💬 Задать вопрос")
            async def handle_question_button(message: Message):
                Bot.set_current(bot)
                user_id = message.from_user.id
                await bot.send_message(
                    user_id,
                    f"💬 <b>Задать вопрос</b>\n\n"
                    f"Если у тебя есть вопросы по использованию калькулятора или нужна помощь, "
                    f"напиши нам в канале: {config.channel_link}",
                    parse_mode='HTML'
                )
            
            @dp.message_handler(lambda m: m.text == "🌐 Сайт агентства T&M")
            async def handle_website_button(message: Message):
                Bot.set_current(bot)
                user_id = message.from_user.id
                await bot.send_message(
                    user_id,
                    f"🌐 <b>T&M Agency</b>\n\n"
                    f"Мы помогаем продвигать Telegram-каналы и создавать эффективные маркетинговые кампании.\n\n"
                    f"🔗 Наш сайт: https://www.tmads.ru/",
                    parse_mode='HTML'
                )
        
        # Обработчик неизвестных сообщений
        @dp.message_handler()
        async def handle_unknown(message: Message):
            Bot.set_current(bot)
            await bot.send_message(message.from_user.id, "Используй /start для начала работы")
        
        logger.info(f"✅ Обработчики для {bot_name} зарегистрированы")
    
    async def set_webhooks(self):
        """Установка webhook для всех ботов - ВЕРСИЯ С ПРЯМЫМИ API ВЫЗОВАМИ"""
        logger.info("=" * 60)
        logger.info("🔧 НАЧАЛО УСТАНОВКИ WEBHOOK - ВЕРСИЯ С ПРЯМЫМИ API ВЫЗОВАМИ")
        logger.info("=" * 60)
        
        if not WEBHOOK_URL:
            logger.warning("WEBHOOK_URL не установлен. Используется polling режим.")
            return
        
        webhook_base = WEBHOOK_URL.rstrip('/')
        if not webhook_base.startswith('http'):
            webhook_base = f"https://{webhook_base}"
        
        logger.info(f"🌐 Базовый URL webhook: {webhook_base}")
        
        for bot_name, bot_instance in self.bots.items():
            logger.info(f"🔧 Обработка бота {bot_name}...")
            try:
                # ВАЖНО: Используем config.token, НЕ bot.token!
                config = self.configs[bot_name]
                token = config.token  # Используем токен из конфига
                
                logger.info(f"🔧 Конфиг для {bot_name} получен, токен: {token[:10] if token else 'НЕТ'}...")
                
                # Проверяем, что токен установлен
                if not token:
                    logger.warning(f"⚠️ Токен для {bot_name} не установлен, пропускаю webhook")
                    continue
                
                webhook_path = f"{webhook_base}/webhook/{token}"
                logger.info(f"🔧 Установка webhook для {bot_name}: {webhook_path[:50]}...")
                
                # Удаляем старый webhook через прямой API вызов
                try:
                    async with ClientSession() as session:
                        delete_url = f"https://api.telegram.org/bot{token}/deleteWebhook"
                        async with session.post(delete_url) as resp:
                            if resp.status == 200:
                                logger.info(f"✅ Старый webhook для {bot_name} удалён")
                            else:
                                logger.warning(f"⚠️ Не удалось удалить старый webhook для {bot_name}: статус {resp.status}")
                except Exception as e:
                    logger.warning(f"⚠️ Ошибка при удалении старого webhook для {bot_name}: {e}")
                
                # Устанавливаем новый webhook через прямой API вызов
                async with ClientSession() as session:
                    set_url = f"https://api.telegram.org/bot{token}/setWebhook"
                    data = {
                        "url": webhook_path,
                        "allowed_updates": ["message", "callback_query"]
                    }
                    async with session.post(set_url, json=data) as resp:
                        result = await resp.json()
                        if result.get("ok"):
                            logger.info(f"✅ Webhook для {bot_name} установлен: {webhook_path}")
                        else:
                            logger.error(f"❌ Ошибка при установке webhook для {bot_name}: {result.get('description', 'Unknown error')}")
                
                # Ждём немного перед проверкой webhook
                await asyncio.sleep(1)
                
                # Проверяем установку webhook
                async with ClientSession() as session:
                    get_url = f"https://api.telegram.org/bot{token}/getWebhookInfo"
                    async with session.get(get_url) as resp:
                        webhook_info = await resp.json()
                        if webhook_info.get("ok"):
                            actual_url = webhook_info.get("result", {}).get("url", "")
                            if actual_url == webhook_path:
                                logger.info(f"✅ Webhook для {bot_name} подтверждён: {webhook_path}")
                            else:
                                logger.warning(f"⚠️ Webhook для {bot_name} не совпадает: ожидалось {webhook_path}, получено {actual_url}")
                                # Пытаемся установить ещё раз
                                logger.info(f"🔄 Повторная установка webhook для {bot_name}...")
                                async with ClientSession() as retry_session:
                                    async with retry_session.post(set_url, json=data) as retry_resp:
                                        retry_result = await retry_resp.json()
                                        if retry_result.get("ok"):
                                            logger.info(f"✅ Webhook для {bot_name} установлен повторно")
                        else:
                            logger.error(f"❌ Не удалось проверить webhook для {bot_name}: {webhook_info.get('description', 'Unknown error')}")
                    
            except Exception as e:
                logger.error(f"❌ Ошибка при установке webhook для {bot_name}: {e}")
                logger.error(f"Тип ошибки: {type(e).__name__}")
                logger.error(f"Трассировка: {traceback.format_exc()}")
        
        logger.info("=" * 60)
        logger.info("🔧 ЗАВЕРШЕНИЕ УСТАНОВКИ WEBHOOK")
        logger.info("=" * 60)
    
    async def process_webhook(self, token: str, update_data: dict) -> web.Response:
        """Обработка webhook запроса"""
        logger.info(f"📥 Получен webhook для токена: {token[:10]}...")
        
        # Находим бота по токену
        bot_name = None
        for name, config in self.configs.items():
            if config.token == token:
                bot_name = name
                break
        
        if not bot_name:
            logger.warning(f"❌ Бот с токеном {token[:10]}... не найден")
            logger.warning(f"Доступные токены: {[c.token[:10] + '...' for c in self.configs.values()]}")
            return web.Response(status=404, text="Bot not found")
        
        logger.info(f"✅ Найден бот: {bot_name}")
        
        try:
            dp = self.dispatchers[bot_name]
            bot = self.bots[bot_name]
            
            # Создаём Update объект
            update = Update(**update_data)
            logger.info(f"📨 Обработка обновления для {bot_name}: {update.update_id}")
            
            # Обрабатываем обновление через dispatcher
            await dp.process_update(update)
            
            logger.info(f"✅ Обновление {update.update_id} обработано успешно")
            return web.Response(status=200, text="OK")
        except Exception as e:
            logger.error(f"❌ [{bot_name}] Ошибка при обработке webhook: {e}")
            logger.error(f"Трассировка: {traceback.format_exc()}")
            return web.Response(status=500, text="Internal error")


# Глобальный менеджер ботов
bot_manager = BotManager()

# Регистрация ботов
# BOT1 - ROI калькулятор бот
bot_manager.register_bot("BOT1")

# BOT2 - Gigtest бот
bot_manager.register_bot("BOT2")


# Создание aiohttp приложения
app = web.Application()

# Health check endpoint
async def health_check(request):
    return web.Response(text="OK")

# Webhook endpoint
async def webhook_handler(request):
    # Извлекаем токен из URL: /webhook/{token}
    token = request.match_info.get('token', '')
    
    logger.info(f"🌐 WEBHOOK ЗАПРОС: {request.method} {request.path_qs}, token={token[:10] if token else 'НЕТ'}...")
    logger.info(f"🌐 Headers: {dict(request.headers)}")
    
    if not token:
        logger.error("❌ Токен не найден в URL")
        return web.Response(status=400, text="Token required")
    
    try:
        logger.info(f"🌐 Читаю JSON данные...")
        update_data = await request.json()
        logger.info(f"📦 Данные обновления получены: update_id={update_data.get('update_id', 'unknown')}, тип={list(update_data.keys())}")
        result = await bot_manager.process_webhook(token, update_data)
        logger.info(f"✅ Webhook обработан успешно")
        return result
    except Exception as e:
        logger.error(f"❌ Ошибка при обработке webhook: {e}")
        logger.error(f"Тип ошибки: {type(e).__name__}")
        logger.error(f"Трассировка: {traceback.format_exc()}")
        return web.Response(status=500, text="Internal error")

# Регистрация роутов
app.router.add_get('/health', health_check)
app.router.add_get('/', health_check)
app.router.add_post('/webhook/{token}', webhook_handler)

# Startup функция
async def on_startup(app):
    logger.info("🚀 Запуск мульти-бота...")
    logger.info(f"✅ Зарегистрировано ботов: {len(bot_manager.bots)}")
    logger.info("🔧 Версия кода: 2025-11-22 - Использует прямые API вызовы для webhook")
    await bot_manager.set_webhooks()
    logger.info(f"✅ Запущено ботов: {len(bot_manager.bots)}")

# Shutdown функция
async def on_shutdown(app):
    logger.info("🛑 Остановка мульти-бота...")
    for bot_name, bot in bot_manager.bots.items():
        try:
            await bot.delete_webhook()
            await bot.session.close()
            logger.info(f"✅ Бот {bot_name} остановлен")
        except Exception as e:
            logger.error(f"❌ Ошибка при остановке {bot_name}: {e}")

app.on_startup.append(on_startup)
app.on_shutdown.append(on_shutdown)

if __name__ == "__main__":
    logger.info("=" * 80)
    logger.info(f"🚀 ЗАПУСК МУЛЬТИ-БОТА - ВЕРСИЯ: {CODE_VERSION}")
    logger.info("=" * 80)
    port = int(os.getenv("PORT", 10000))
    logger.info(f"Запуск сервера на порту {port}")
    web.run_app(app, port=port, host='0.0.0.0')
