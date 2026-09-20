// Конфигурация приложения
// Этот файл загружает настройки из .env файла или использует значения по умолчанию

class Config {
    constructor() {
        this.loadConfig();
    }

    loadConfig() {
        // Discord Webhook URL (из .env или значение по умолчанию)
        this.DISCORD_WEBHOOK_URL = this.getEnv('DISCORD_WEBHOOK_URL', 
            'https://discord.com/api/webhooks/1551123668967489596/bO2oosj9vuULqWkiDkrSYjbsNVhlSVR0FdIt1jwcGNZY5PpEavr4YVZxq0MwWvSCmqhO');
        
        // Настройки записи
        this.MAX_FILE_SIZE_MB = parseInt(this.getEnv('MAX_FILE_SIZE_MB', '20'));
        this.VIDEO_QUALITY = this.getEnv('VIDEO_QUALITY', '720p');
        this.VIDEO_FPS = parseInt(this.getEnv('VIDEO_FPS', '30'));
        this.AUDIO_BITRATE = parseInt(this.getEnv('AUDIO_BITRATE', '128000'));
        this.VIDEO_BITRATE = parseInt(this.getEnv('VIDEO_BITRATE', '2500000'));
        
        // Настройки приложения
        this.ENABLE_DEBUG = this.getEnv('ENABLE_DEBUG', 'true') === 'true';
        this.AUTO_SEND = this.getEnv('AUTO_SEND', 'true') === 'true';
        this.RECORD_ON_PLAY = this.getEnv('RECORD_ON_PLAY', 'true') === 'true';
        
        // Вычисленные настройки
        this.MAX_FILE_SIZE_BYTES = this.MAX_FILE_SIZE_MB * 1024 * 1024;
        
        // Проверка конфигурации
        this.validateConfig();
    }

    getEnv(key, defaultValue) {
        // В реальном приложении здесь должна быть загрузка из .env файла
        // Для демонстрации возвращаем значения по умолчанию
        return defaultValue;
    }

    validateConfig() {
        if (!this.DISCORD_WEBHOOK_URL || !this.DISCORD_WEBHOOK_URL.startsWith('https://discord.com/api/webhooks/')) {
            console.warn('⚠️ Некорректный Discord webhook URL');
        }

        if (this.MAX_FILE_SIZE_MB < 1 || this.MAX_FILE_SIZE_MB > 100) {
            console.warn('⚠️ MAX_FILE_SIZE_MB должно быть между 1 и 100 МБ');
            this.MAX_FILE_SIZE_MB = 20;
        }

        if (this.VIDEO_BITRATE < 100000 || this.VIDEO_BITRATE > 10000000) {
            console.warn('⚠️ VIDEO_BITRATE должно быть между 100кбит/с и 10Мбит/с');
            this.VIDEO_BITRATE = 2500000;
        }
    }

    getVideoConstraints() {
        const constraints = {
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100,
                channelCount: 2
            },
            video: {}
        };

        // Настройки качества видео
        switch (this.VIDEO_QUALITY) {
            case '360p':
                constraints.video = {
                    width: { ideal: 640 },
                    height: { ideal: 360 },
                    frameRate: { ideal: this.VIDEO_FPS }
                };
                break;
            case '480p':
                constraints.video = {
                    width: { ideal: 854 },
                    height: { ideal: 480 },
                    frameRate: { ideal: this.VIDEO_FPS }
                };
                break;
            case '720p':
                constraints.video = {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: this.VIDEO_FPS }
                };
                break;
            case '1080p':
                constraints.video = {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    frameRate: { ideal: this.VIDEO_FPS }
                };
                break;
            default:
                constraints.video = {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: this.VIDEO_FPS }
                };
        }

        return constraints;
    }

    getMediaRecorderOptions() {
        return {
            mimeType: 'video/webm;codecs=vp9,opus',
            audioBitsPerSecond: this.AUDIO_BITRATE,
            videoBitsPerSecond: this.VIDEO_BITRATE
        };
    }

    getRecordingConfig() {
        return {
            MAX_FILE_SIZE_MB: this.MAX_FILE_SIZE_MB,
            MAX_FILE_SIZE_BYTES: this.MAX_FILE_SIZE_BYTES,
            CHECK_INTERVAL: 1000,
            VIDEO_MIME_TYPE: 'video/webm;codecs=vp9,opus',
            BITRATE: this.VIDEO_BITRATE
        };
    }

    logConfig() {
        if (this.ENABLE_DEBUG) {
            console.log('📋 Конфигурация приложения:');
            console.log(`• Discord Webhook: ${this.DISCORD_WEBHOOK_URL ? 'Настроен' : 'Не настроен'}`);
            console.log(`• Макс. размер файла: ${this.MAX_FILE_SIZE_MB} МБ`);
            console.log(`• Качество видео: ${this.VIDEO_QUALITY}`);
            console.log(`• FPS: ${this.VIDEO_FPS}`);
            console.log(`• Битрейт видео: ${this.VIDEO_BITRATE} бит/с`);
            console.log(`• Битрейт аудио: ${this.AUDIO_BITRATE} бит/с`);
            console.log(`• Отладка: ${this.ENABLE_DEBUG ? 'Включена' : 'Выключена'}`);
        }
    }
}

// Создаем и экспортируем экземпляр конфигурации
const config = new Config();
config.logConfig();

export default config;