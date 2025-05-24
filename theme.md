# Minimal Directory Listing Theme

A complete guide to recreating the exact minimal monochrome directory listing aesthetic inspired by ophelia.red.

## Overview

This theme recreates the authentic feel of classic Unix/Linux directory listings with:
- Monospace typography throughout
- Automatic dark/light mode support
- Table-based layouts
- Minimal, functional styling
- No modern UI flourishes

## 1. Foundation HTML Structure

Start with a clean, semantic HTML structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Index of /your-app</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Index of /your-app</h1>
        <div class="path-info">your-domain.com</div>
    </header>
    
    <!-- Your content here -->
    
    <address>
        Your footer content here...
    </address>
</body>
</html>
```

## 2. Core CSS Foundation

### Base Typography & Layout

```css
/* The foundation - this sets everything */
html {
    font-family: monospace;
    font-size: 13px;
    line-height: 1.5;
    color: #000;
    background-color: #fff;
    max-width: 960px;
    margin: 0 auto;
    padding: 2rem;
}

body {
    margin: 0;
}
```

**Key Points:**
- `font-family: monospace` - Uses system monospace font
- `font-size: 13px` - Classic terminal size
- `line-height: 1.5` - Proper spacing for readability
- `max-width: 960px` - Centered content area
- `margin: 0 auto` - Centers the content block
- `padding: 2rem` - Breathing room around content

### Header Styling

```css
header {
    margin: 0;
    padding: 0;
}

h1 {
    font-size: 13px;
    font-weight: normal;
    margin: 0 0 1rem 0;
}
```

**Critical Details:**
- Header has NO padding/margin
- H1 uses same 13px size as body text
- `font-weight: normal` - no bold text
- `margin: 0 0 1rem 0` - only bottom margin

## 3. Dark Mode Support

```css
/* Automatic dark mode based on system preference */
@media (prefers-color-scheme: dark) {
    html {
        color: #fff;
        background-color: #000;
    }
    a, th, td {
        color: #fff;
    }
    tr:nth-child(even) {
        background-color: #111;
    }
    tr:hover {
        background-color: #222;
    }
    th, address {
        border-color: #333;
    }
}
```

**Why This Works:**
- Uses `prefers-color-scheme` - respects user's system setting
- Inverts colors: white text on black background
- Adjusts table row colors for dark theme
- Changes border colors to work on dark background

## 4. Table Styling (Core Directory Feel)

```css
table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
}

th {
    text-align: left;
    padding: 0.5rem;
    border-bottom: 1px solid #eee;
    font-weight: normal;
}

td {
    padding: 0.5rem;
    border-bottom: 1px solid #f5f5f5;
}

/* Alternating row colors */
tr:nth-child(even) {
    background-color: #f9f9f9;
}

tr:hover {
    background-color: #f0f0f0;
}
```

**Directory Listing Authenticity:**
- `border-collapse: collapse` - clean table borders
- `text-align: left` - like real directory listings
- `font-weight: normal` - no bold headers
- Subtle alternating row colors (`#f9f9f9`)
- Hover effect (`#f0f0f0`) for interactivity

## 5. Link Styling (Critical for Authenticity)

```css
/* Base link styling */
a {
    text-decoration: none;
    color: #000;
}

/* Override - this creates the authentic directory feel */
a {
    color: inherit;
    text-decoration: underline;
}
```

**Why Two Rules:**
- First rule sets base behavior
- Second rule overrides to `color: inherit` - links inherit parent color
- `text-decoration: underline` - classic underlined links
- This matches exactly how directory listings work

## 6. Form Elements

```css
input {
    font-family: monospace;
    font-size: 13px;
    padding: 2px 4px;
    border: 1px solid #ccc;
    background-color: #fff;
    color: #000;
    margin-right: 0.5rem;
}

button {
    font-family: monospace;
    font-size: 13px;
    padding: 2px 6px;
    border: 1px solid #000;
    background-color: #fff;
    color: #000;
    cursor: pointer;
    margin-right: 0.5rem;
}

button:hover {
    background-color: #f0f0f0;
}
```

**Form Authenticity:**
- Same monospace font and 13px size
- Minimal padding (`2px 4px`, `2px 6px`)
- Simple borders, no border-radius
- Subtle hover states

## 7. Footer/Address Styling

```css
address {
    margin-top: 2rem;
    font-style: normal;
    border-top: 1px solid #eee;
    padding-top: 1rem;
}
```

**Classic Footer:**
- `font-style: normal` - removes italic from address element
- `border-top` - separates from main content
- Proper spacing with margin and padding

## 8. Dark Mode for Custom Elements

```css
@media (prefers-color-scheme: dark) {
    input, button {
        background-color: #000;
        color: #fff;
        border-color: #333;
    }
    
    button:hover {
        background-color: #222;
    }
}
```

## 9. Mobile Responsiveness

```css
@media (max-width: 768px) {
    html {
        padding: 1rem;
    }
    
    table {
        font-size: 12px;
    }
    
    th, td {
        padding: 0.25rem;
    }
}
```

## 10. Modal/Dialog Styling

```css
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.modal.show {
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: #fff;
    color: #000;
    border: 1px solid #ccc;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    font-family: monospace;
    font-size: 13px;
}

@media (prefers-color-scheme: dark) {
    .modal-content {
        background: #000;
        color: #fff;
        border-color: #333;
    }
}
```

## Implementation Checklist

### ✅ Essential Elements:
- [ ] Monospace font family throughout
- [ ] 13px font size consistently
- [ ] `line-height: 1.5` for readability
- [ ] 960px max-width, centered
- [ ] 2rem padding on html element
- [ ] No top margin/padding on header
- [ ] `font-weight: normal` on headings
- [ ] `color: inherit` on links with underlines
- [ ] Table with `border-collapse: collapse`
- [ ] Alternating row colors (`#f9f9f9`)
- [ ] Automatic dark mode support
- [ ] Address element with top border

### ✅ Dark Mode Requirements:
- [ ] White text on black background
- [ ] All text elements inherit white color
- [ ] Table rows use `#111` and `#222` colors
- [ ] Borders use `#333` color
- [ ] Form elements have dark backgrounds

### ✅ Spacing & Layout:
- [ ] 1rem margins on key elements
- [ ] 0.5rem padding in table cells
- [ ] Minimal padding on form elements
- [ ] Proper separation with borders

## Common Mistakes to Avoid

1. **Using different font sizes** - Everything should be 13px
2. **Adding border-radius** - Keep everything sharp/square
3. **Using bold fonts** - Everything is `font-weight: normal`
4. **Forgetting `color: inherit` on links** - Critical for authenticity
5. **Adding shadows or gradients** - Keep it flat
6. **Wrong dark mode colors** - Use exact hex values provided
7. **Improper table styling** - Must use `border-collapse: collapse`

## Testing Your Implementation

1. **Light Mode Test:** Should look like a classic terminal/directory listing
2. **Dark Mode Test:** Switch system to dark mode - should invert cleanly
3. **Typography Test:** All text should be monospace, 13px
4. **Link Test:** Links should inherit parent color and be underlined
5. **Table Test:** Alternating rows, proper hover states
6. **Mobile Test:** Should remain readable on small screens

This theme creates an authentic, minimal directory listing experience that feels both nostalgic and timeless. 