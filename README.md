# Лабораторная работа №4

## Описание

Приложение для проверки попадания точки в область на координатной плоскости.

## Технологии

### Back-end:
- Java EE с EJB
- REST API (JAX-RS)
- JPA с Apache Derby
- BCrypt для хэширования паролей

### Front-end:
- React 18
- Redux для управления состоянием
- Belle для UI компонентов
- Адаптивный дизайн (десктоп, планшет, мобильный)

## Структура проекта

```
Лаб4/
├── Web4/                    # Back-end приложение
│   ├── src/main/java/      # Java исходники
│   │   ├── ejb/            # EJB компоненты
│   │   ├── rest/           # REST endpoints
│   │   ├── entity/         # JPA entities
│   │   └── dto/            # Data Transfer Objects
│   └── src/main/resources/ # Конфигурация
│       └── META-INF/
│           └── persistence.xml
└── Web4Frontend/            # Front-end приложение
    ├── src/
    │   ├── components/     # React компоненты
    │   ├── store/          # Redux store
    │   └── styles.css      # Стили
    └── public/
        └── index.html
```

## Установка и запуск

### Back-end

1. Убедитесь, что установлен WildFly (рекомендуется версия 27+)
2. Скопируйте файл `Web4/src/main/resources/derby-ds.xml` в `WILDFLY_HOME/standalone/configuration/`
3. Установите модуль Apache Derby в WildFly:
   ```bash
   cd WILDFLY_HOME/modules
   mkdir -p org/apache/derby/main
   ```
   Скопируйте `derby-10.16.1.1.jar` в `org/apache/derby/main/`
   Создайте `module.xml`:
   ```xml
   <module xmlns="urn:jboss:module:1.9" name="org.apache.derby">
       <resources>
           <resource-root path="derby-10.16.1.1.jar"/>
       </resources>
       <dependencies>
           <module name="javax.api"/>
           <module name="javax.transaction.api"/>
       </dependencies>
   </module>
   ```

4. Соберите проект:
   ```bash
   cd Web4
   ./gradlew build
   ```

5. Разверните WAR файл в WildFly:
   ```bash
   cp build/libs/web4.war WILDFLY_HOME/standalone/deployments/
   ```

6. Запустите WildFly и убедитесь, что приложение развернуто

### Front-end

1. Установите зависимости:
   ```bash
   cd Web4Frontend
   npm install
   ```

2. Запустите dev-сервер:
   ```bash
   npm start
   ```

3. Откройте браузер по адресу `http://localhost:3000`

## Использование

1. На стартовой странице введите логин и пароль (или зарегистрируйтесь)
2. После входа вы попадете на основную страницу
3. Выберите значения X и R с помощью чекбоксов
4. Введите значение Y в текстовое поле (от -5 до 5)
5. Нажмите "Отправить" или кликните на графике для проверки точки
6. Результаты отображаются в таблице
7. Для выхода нажмите "Выйти из системы"

## Вариант задания (88744)

Область состоит из:
1. Прямоугольник во 2-й четверти: x от -R/2 до 0, y от 0 до R
2. Треугольник в 1-й четверти: x от 0 до R/2, y от 0 до R, y <= R - 2x
3. Четверть круга в 3-й четверти: центр (0,0), радиус R

## Адаптивный дизайн

- **Десктопный** (>= 1189px): двухколоночная сетка, canvas 500x500
- **Планшетный** (766px - 1188px): одноколоночная сетка, canvas 400x400
- **Мобильный** (< 766px): одноколоночная сетка, canvas адаптивный

## API Endpoints

### Аутентификация
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/register` - Регистрация

### Результаты
- `POST /api/results/check?userId={id}` - Проверка точки
- `GET /api/results?userId={id}` - Получить все результаты
- `DELETE /api/results?userId={id}` - Очистить результаты

## Локальная сборка для развертывания

Для сборки всего проекта (frontend + backend) локально и подготовки к развертыванию:

- **[BUILD_LOCAL.md](BUILD_LOCAL.md)** - Подробная инструкция по локальной сборке
- **build-local.sh** / **build-local.bat** - Скрипты автоматической сборки

### Быстрая сборка:
```bash
# Windows
build-local.bat

# Linux/Mac
chmod +x build-local.sh
./build-local.sh

# Или через Gradle
cd Web4
./gradlew clean build
```

Результат: `Web4/build/libs/web4.war` - готовый к развертыванию файл со встроенным frontend.

## Развертывание на Linux сервере

Для развертывания приложения на удаленном Linux сервере см.:
- **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - Быстрая инструкция по развертыванию
- **[DEPLOYMENT_LINUX.md](DEPLOYMENT_LINUX.md)** - Подробная инструкция с объяснениями
- **deploy.sh** - Скрипт автоматического развертывания

### Быстрый старт:
```bash
# Вариант 1: Собрать локально и скопировать WAR на сервер
# (локально) build-local.sh
# (на сервере) cp web4.war /opt/wildfly/standalone/deployments/

# Вариант 2: Собрать на сервере
sudo ./deploy.sh production
```

## Документация

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Подробное описание архитектуры проекта
- **[REQUIREMENTS_COMPLIANCE.md](REQUIREMENTS_COMPLIANCE.md)** - Соответствие требованиям ТЗ


