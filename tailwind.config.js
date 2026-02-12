/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
function rem2px(input, fontSize = 16) {
    if (input == null) {
        return input;
    }
    switch (typeof input) {
        case "object":
            if (Array.isArray(input)) {
                return input.map((val) => rem2px(val, fontSize));
            } else {
                const ret = {};
                for (const key in input) {
                    ret[key] = rem2px(input[key]);
                }
                return ret;
            }
        case "string":
            return input.replace(
                /(\d*\.?\d+)rem$/,
                (_, val) => parseFloat(val) * fontSize + "px"
            );
        default:
            return input;
    }
}
module.exports = {
    darkMode: ["class"],
    content: [
        './entrypoints/**/*.{html,ts,tsx}',
        './components/**/*.{html,ts,tsx}'
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                sans: ['Cabin', 'system-ui', 'sans-serif'],
                mono: ['Inconsolata', 'ui-monospace', 'SFMono-Regular', 'monospace'],
            },
            fontSize: {
                base: '16px',
            },
            colors: {
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--secondary-foreground)",
                },
                destructive: {
                    DEFAULT: "var(--destructive)",
                    foreground: "var(--destructive-foreground)",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },
                popover: {
                    DEFAULT: "var(--popover)",
                    foreground: "var(--popover-foreground)",
                },
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },
                // Custom semantic colors - using existing theme colors as fallbacks
                "table-header": "var(--muted)",
                "table-hover": "var(--accent)",
                "button-hover": "var(--accent)",
                "text-muted": "var(--muted-foreground)",
                "text-dark": "var(--foreground)",
                "text-light": "var(--muted-foreground)",
                "border-hover": "var(--border)",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: {height: "0"},
                    to: {height: "var(--radix-accordion-content-height)"},
                },
                "accordion-up": {
                    from: {height: "var(--radix-accordion-content-height)"},
                    to: {height: "0"},
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}