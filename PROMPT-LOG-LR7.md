# Промпт-паспорт · Лабораторна робота №7

## Master Prompt

> Act as a senior front-end developer. Extend the existing “Холодильник студента” project from Lab 6 into a complete responsive landing page. Preserve its approved pixel-kitchen visual system, palette, fonts, existing Header, Button, Card and Footer patterns. Use semantic HTML and Tailwind CSS utilities, keep exactly one h1, and do not replace the project or add unnecessary libraries. Build sections for the hero, benefits, how it works, featured recipes, project description, interactive portion and shopping-list calculator, media, shops, CTA and footer. Add a responsive YouTube recipe video, a Google Maps search for grocery shops in Lviv, and one external interactive recipe-scaling widget. Give every iframe an accessible title, lazy loading and a responsive container. Add visible keyboard focus, useful alt text and mobile-first layouts. Preserve existing navigation and recipe pages. Before finishing, review desktop and mobile layouts, semantics, accessibility, iframe sizing and console output; record any deployment or Lighthouse work that requires the owner’s account.

## Ітераційний журнал

Журнал відтворює фактичні етапи роботи в чаті Codex і локальному редакторі. Код не генерувався через AI Chat у VS Code, тому цей журнал не приписує роботу іншому інструменту.

### Ітерація 1 — Аналіз наявного проєкту

**Запит:** «Візьми проєкт `lab-06-tailwind` за основу для ЛР 7; використай попередні компоненти й збережи тему “Холодильник студента”.»

**Результат:** оглянуто `index.html`, `css/style.css`, сторінки рецептів, зображення, інструкцію запуску та попередній журнал промптів. На головній були Hero, три кроки та Footer; рецепти й графічні активи вже існували.

### Ітерація 2 — Структура лендингу

**Запит:** «Перетвори головну на цілісний лендинг, не переписуючи весь багатосторінковий проєкт.»

**Результат:** додано переваги, кроки, картки рецептів, опис проєкту, інструменти, медіасекції, CTA та посилання в навігації. Збережено один `h1` та наявну піксельну дизайн-систему.

### Ітерація 3 — Віджет для теми проєкту

**Запит:** «Додай віджет, пов’язаний із рецептами й продуктами, а не погодою.»

**Результат:** створено український калькулятор порцій зі списком докупки, зовнішній Recipe Scaler і планер тижневого бюджету. Планер рахує залишок та орієнтир витрат на один прийом їжі, відображає прогрес і запам’ятовує значення в браузері.

### Ітерація 4 — Медіа та карта

**Запит:** «Додай відеорецепт із YouTube та карту продуктових магазинів.»

**Результат:** додано чотири відеорецепти: рис із яйцем, гречка з грибами, паста з тунцем і картопля; також карту продуктових магазинів у Львові. В усіх iframe є `title`, `loading="lazy"` та адаптивний контейнер; відео й карта перевірені локально у браузері.

### Ітерація 5 — Адаптивність і перевірка

**Запит:** «Перевір сторінку на десктопній і мобільній ширині, зроби скриншоти та зафіксуй результати.»

**Результат:** у браузері перевірені 1440 px та 390 px; горизонтального переповнення немає. Калькулятор перевірений на 2 і 4 порціях. Зафіксовані скриншоти desktop, mobile, calculator, video та map.

## Перевірені факти

- Один `h1` на головній; у медіаблоці чотири картки з відео.
- Ієрархія секцій позначена заголовками `h2` та `h3`.
- Для YouTube, Google Maps і Recipe Scaler додані назви iframe.
- На мобільній ширині 390 px і desktop 1440 px немає горизонтального скролу.
- Калькулятор для 4 порцій показує 300 г рису, 4 яйця, 2 цибулини й 30 мл олії.
- Планер бюджету для 2 000 ₴, витрачених 1 900 ₴ і 5 прийомів їжі показує залишок 100 ₴ та орієнтир 20 ₴ за прийом; введені значення зберігаються в браузері.
- Скриншоти збережені в `screenshots/` під префіксом `lab7-`.

## Підсумок перевірки та наступні кроки

- Браузерні перевірки виконані: 1440 px і 390 px, один h1, iframe, калькулятор, список покупок, консоль і мережеві запити.
- Lighthouse запускали локально; звіт не створився через помилку Chrome DevTools WebSocket (`Failed to fetch browser webSocket URL`). Оцінки Lighthouse не вигадувалися.
- Netlify-публікацію не виконували, бо цільовий сайт/акаунт не наданий. Код і скриншоти підготовлені локально; для публікації потрібен конкретний сайт власника.
