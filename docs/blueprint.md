# **App Name**: SwiftPOS

## Core Features:

- Authentication & Authorization: Secure login/logout with role-based access (Admin, Cashier, Manager) and JWT-based session management.
- Product Management: Manage product catalog with CRUD operations, categories, stock levels, images, and UOM. Uses the /api/products and /api/categories endpoints.
- Promotion System: Interface to manage promotions with percentage and fixed amounts. Preview available before applying.  Utilizes the /api/promotions and /api/cart/check-promotion endpoints.
- Shopping Cart & Checkout: Add/remove products, adjust quantities, apply promotions, select customer, and view order summary with real-time calculations.
- Order Management: View order history, track order status, search orders, and generate receipts.
- Customer Management: Maintain customer database, search customers, view order history, and manage customer information.
- AI-Powered Product Recommendations: An AI tool that uses transaction history and other relevant data to recommend the most likely product the customer may wish to buy, and suggest adding it to the shopping cart.

## Style Guidelines:

- Primary color: Deep blue (#3B82F6), providing a sense of trust and reliability for financial transactions.
- Background color: Light gray (#F9FAFB), which is easy on the eyes for extended use.
- Accent color: Orange (#EA580C), draws user attention to important CTAs like 'Checkout' and 'Add Promotion', creating a sense of urgency.
- Body and headline font: 'Inter', a grotesque-style sans-serif font providing a modern, objective, and neutral aesthetic suitable for a professional user interface.
- Use Lucide React icons for a consistent and modern look.
- Responsive design adapts to different screen sizes, ensuring a consistent user experience across devices.
- Subtle animations using Framer Motion to provide feedback and guide users through the POS system.