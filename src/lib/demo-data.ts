export interface User {
  id: string;
  username: string;
  password: string;
  role: "admin" | "shopowner" | "customer";
  email: string;
  name: string;
  phone?: string;
}

export interface Shop {
  id: string;
  shop_name: string;
  owner_id: string;
  owner_name: string;
  category: string;
  phone: string;
  city: string;
  area: string;
  pincode: string;
  rating: number;
  description: string;
  image?: string;
  approved: boolean;
}

export interface Product {
  id: string;
  shop_id: string;
  product_name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  image?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  shop_id: string;
  total_amount: number;
  status: "Pending" | "Confirmed" | "Cancelled" | "Partial" | "Completed";
  timestamp: string;
  approved_at?: string;
  completed_at?: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export interface SalesEntry {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  date: string;
  price: number;
  shop_id: string;
}

export interface CallLog {
  id: string;
  type: "robocall" | "masked";
  caller_id: string;
  receiver_id: string;
  caller_name: string;
  receiver_name: string;
  masked_number: string;
  call_duration: number;
  timestamp: string;
  status: "initiated" | "completed" | "missed";
  order_id?: string;
  transcript?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  shop_id: string;
}

export const demoUsers: User[] = [
  { id: "u1", username: "admin", password: "vendorplus@admin", role: "admin", email: "admin@vendorplus.com", name: "Admin User" },
  { id: "u2", username: "shopowner", password: "shopowner@vp", role: "shopowner", email: "owner@bigbite.com", name: "Rahul Sharma", phone: "9876543210" },
  { id: "u3", username: "customer1", password: "customer123", role: "customer", email: "customer@example.com", name: "Priya Patel", phone: "9876501234" },
];

export const demoShops: Shop[] = [
  { id: "s1", shop_name: "Big Bite Confectionary", owner_id: "u2", owner_name: "Rahul Sharma", category: "Confectionary", phone: "+918476003000", city: "Dehradun", area: "Bidholi, UPES", pincode: "248007", rating: 4.5, description: "Your favourite sweets and snacks destination since 2015.", approved: true },
  { id: "s2", shop_name: "Radhe Confectionary", owner_id: "u4", owner_name: "Amit Patel", category: "Confectionary", phone: "+918476003000", city: "Dehradun", area: "Bidholi, UPES", pincode: "248007", rating: 4.2, description: "Traditional Indian sweets and bakery items.", approved: true },
  { id: "s3", shop_name: "Shake and Sip", owner_id: "u5", owner_name: "Vikram Singh", category: "Fruit Shop", phone: "+918476003000", city: "Dehradun", area: "Bidholi, UPES", pincode: "248007", rating: 4.7, description: "Fresh fruit juices and shakes made to order.", approved: true },
  { id: "s4", shop_name: "8th Planet", owner_id: "u6", owner_name: "Neha Gupta", category: "Confectionary", phone: "+918476003000", city: "Dehradun", area: "Bidholi, UPES", pincode: "248007", rating: 4.8, description: "Premium sweets, chocolates and bakery delights for every occasion.", approved: true },
  { id: "s5", shop_name: "Three Sixty Stationary Shop", owner_id: "u7", owner_name: "Rajesh Kumar", category: "Stationary", phone: "+918476003000", city: "Dehradun", area: "Bidholi, UPES", pincode: "248007", rating: 4.0, description: "All your office and school supplies under one roof.", approved: true },
  { id: "s6", shop_name: "Aman Fruit Shop", owner_id: "u8", owner_name: "Aman Verma", category: "Fruit Shop", phone: "+918476003000", city: "Dehradun", area: "Bidholi, UPES", pincode: "248007", rating: 4.3, description: "Fresh seasonal fruits and fruit chaat daily.", approved: true },
  { id: "s7", shop_name: "Easy Grab General Store", owner_id: "u9", owner_name: "Suresh Mehta", category: "General Store", phone: "+918476003000", city: "Dehradun", area: "Bidholi, UPES", pincode: "248007", rating: 4.1, description: "Your neighbourhood one-stop shop for daily essentials.", approved: true },
];

export const demoProducts: Product[] = [
  // Big Bite Confectionary - Chocolates, Pastry & Cakes, Ice Cream
  { id: "p1", shop_id: "s1", product_name: "Cadbury Dairy Milk", category: "Chocolates", price: 50, unit: "piece", stock: 60 },
  { id: "p2", shop_id: "s1", product_name: "KitKat", category: "Chocolates", price: 40, unit: "piece", stock: 50 },
  { id: "p3", shop_id: "s1", product_name: "5 Star", category: "Chocolates", price: 20, unit: "piece", stock: 80 },
  { id: "p4", shop_id: "s1", product_name: "Perk", category: "Chocolates", price: 10, unit: "piece", stock: 100 },
  { id: "p5", shop_id: "s1", product_name: "Munch", category: "Chocolates", price: 10, unit: "piece", stock: 90 },
  { id: "p6", shop_id: "s1", product_name: "Snickers", category: "Chocolates", price: 60, unit: "piece", stock: 40 },
  { id: "p7", shop_id: "s1", product_name: "Milky Bar", category: "Chocolates", price: 30, unit: "piece", stock: 70 },
  { id: "p8", shop_id: "s1", product_name: "Bounty", category: "Chocolates", price: 80, unit: "piece", stock: 30 },
  { id: "p9", shop_id: "s1", product_name: "Cadbury Fuse", category: "Chocolates", price: 45, unit: "piece", stock: 55 },
  { id: "p10", shop_id: "s1", product_name: "Cadbury Temptations", category: "Chocolates", price: 150, unit: "piece", stock: 20 },
  { id: "p11", shop_id: "s1", product_name: "Black Forest Pastry", category: "Pastry & Cakes", price: 80, unit: "piece", stock: 15 },
  { id: "p12", shop_id: "s1", product_name: "Chocolate Truffle Cake", category: "Pastry & Cakes", price: 500, unit: "piece", stock: 8 },
  { id: "p13", shop_id: "s1", product_name: "Pineapple Pastry", category: "Pastry & Cakes", price: 70, unit: "piece", stock: 18 },
  { id: "p14", shop_id: "s1", product_name: "Butterscotch Cake", category: "Pastry & Cakes", price: 450, unit: "piece", stock: 6 },
  { id: "p15", shop_id: "s1", product_name: "Red Velvet Cake", category: "Pastry & Cakes", price: 550, unit: "piece", stock: 5 },
  { id: "p16", shop_id: "s1", product_name: "Chocolate Pastry", category: "Pastry & Cakes", price: 75, unit: "piece", stock: 20 },
  { id: "p17", shop_id: "s1", product_name: "Fruit Cake", category: "Pastry & Cakes", price: 400, unit: "piece", stock: 7 },
  { id: "p18", shop_id: "s1", product_name: "Vanilla Cake", category: "Pastry & Cakes", price: 350, unit: "piece", stock: 10 },
  { id: "p19", shop_id: "s1", product_name: "Coffee Cake", category: "Pastry & Cakes", price: 480, unit: "piece", stock: 4 },
  { id: "p20", shop_id: "s1", product_name: "Mango Cake", category: "Pastry & Cakes", price: 420, unit: "piece", stock: 6 },
  { id: "p21", shop_id: "s1", product_name: "Amul Ice Cream", category: "Ice Cream", price: 80, unit: "piece", stock: 30 },
  { id: "p22", shop_id: "s1", product_name: "Kwality Walls", category: "Ice Cream", price: 90, unit: "piece", stock: 25 },
  { id: "p23", shop_id: "s1", product_name: "Vadilal", category: "Ice Cream", price: 70, unit: "piece", stock: 35 },
  { id: "p24", shop_id: "s1", product_name: "Havmor", category: "Ice Cream", price: 100, unit: "piece", stock: 20 },
  { id: "p25", shop_id: "s1", product_name: "Mother Dairy Ice Cream", category: "Ice Cream", price: 60, unit: "piece", stock: 40 },
  { id: "p26", shop_id: "s1", product_name: "Baskin Robbins", category: "Ice Cream", price: 200, unit: "piece", stock: 15 },
  { id: "p27", shop_id: "s1", product_name: "Cream Bell", category: "Ice Cream", price: 50, unit: "piece", stock: 30 },
  { id: "p28", shop_id: "s1", product_name: "Naturals Ice Cream", category: "Ice Cream", price: 180, unit: "piece", stock: 12 },
  { id: "p29", shop_id: "s1", product_name: "Top N Town", category: "Ice Cream", price: 40, unit: "piece", stock: 45 },
  { id: "p30", shop_id: "s1", product_name: "Arun Ice Cream", category: "Ice Cream", price: 55, unit: "piece", stock: 28 },

  // Radhe Confectionary - Breads, Patties
  { id: "p31", shop_id: "s2", product_name: "White Bread", category: "Breads", price: 40, unit: "packet", stock: 30 },
  { id: "p32", shop_id: "s2", product_name: "Brown Bread", category: "Breads", price: 50, unit: "packet", stock: 25 },
  { id: "p33", shop_id: "s2", product_name: "Whole Wheat Bread", category: "Breads", price: 55, unit: "packet", stock: 20 },
  { id: "p34", shop_id: "s2", product_name: "Multigrain Bread", category: "Breads", price: 65, unit: "packet", stock: 18 },
  { id: "p35", shop_id: "s2", product_name: "Burger Buns", category: "Breads", price: 45, unit: "packet", stock: 30 },
  { id: "p36", shop_id: "s2", product_name: "Pav Bread", category: "Breads", price: 30, unit: "packet", stock: 40 },
  { id: "p37", shop_id: "s2", product_name: "Garlic Bread", category: "Breads", price: 80, unit: "packet", stock: 15 },
  { id: "p38", shop_id: "s2", product_name: "Sandwich Bread", category: "Breads", price: 45, unit: "packet", stock: 25 },
  { id: "p39", shop_id: "s2", product_name: "Milk Bread", category: "Breads", price: 50, unit: "packet", stock: 22 },
  { id: "p40", shop_id: "s2", product_name: "Fruit Bread", category: "Breads", price: 70, unit: "packet", stock: 12 },
  { id: "p41", shop_id: "s2", product_name: "Veg Patties", category: "Patties", price: 25, unit: "piece", stock: 50 },
  { id: "p42", shop_id: "s2", product_name: "Paneer Patties", category: "Patties", price: 35, unit: "piece", stock: 40 },
  { id: "p43", shop_id: "s2", product_name: "Cheese Patties", category: "Patties", price: 35, unit: "piece", stock: 35 },
  { id: "p44", shop_id: "s2", product_name: "Aloo Patties", category: "Patties", price: 20, unit: "piece", stock: 60 },
  { id: "p45", shop_id: "s2", product_name: "Corn Patties", category: "Patties", price: 30, unit: "piece", stock: 30 },
  { id: "p46", shop_id: "s2", product_name: "Mushroom Patties", category: "Patties", price: 40, unit: "piece", stock: 20 },
  { id: "p47", shop_id: "s2", product_name: "Pizza Patties", category: "Patties", price: 35, unit: "piece", stock: 25 },
  { id: "p48", shop_id: "s2", product_name: "Spinach Patties", category: "Patties", price: 30, unit: "piece", stock: 28 },
  { id: "p49", shop_id: "s2", product_name: "Mixed Veg Patties", category: "Patties", price: 25, unit: "piece", stock: 45 },
  { id: "p50", shop_id: "s2", product_name: "Egg Patties", category: "Patties", price: 30, unit: "piece", stock: 35 },

  // Shake and Sip - Fruits, Juices & Shakes
  { id: "p51", shop_id: "s3", product_name: "Apple", category: "Fruits", price: 180, unit: "kg", stock: 30 },
  { id: "p52", shop_id: "s3", product_name: "Banana", category: "Fruits", price: 40, unit: "dozen", stock: 50 },
  { id: "p53", shop_id: "s3", product_name: "Mango", category: "Fruits", price: 200, unit: "kg", stock: 25 },
  { id: "p300", shop_id: "s3", product_name: "Orange", category: "Fruits", price: 80, unit: "kg", stock: 35 },
  { id: "p301", shop_id: "s3", product_name: "Papaya", category: "Fruits", price: 60, unit: "kg", stock: 20 },
  { id: "p302", shop_id: "s3", product_name: "Pineapple", category: "Fruits", price: 50, unit: "piece", stock: 15 },
  { id: "p303", shop_id: "s3", product_name: "Watermelon", category: "Fruits", price: 30, unit: "kg", stock: 20 },
  { id: "p304", shop_id: "s3", product_name: "Muskmelon (Kharbuja)", category: "Fruits", price: 40, unit: "kg", stock: 18 },
  { id: "p305", shop_id: "s3", product_name: "Pomegranate (Anar)", category: "Fruits", price: 200, unit: "kg", stock: 15 },
  { id: "p306", shop_id: "s3", product_name: "Grapes (Green)", category: "Fruits", price: 120, unit: "kg", stock: 20 },
  { id: "p307", shop_id: "s3", product_name: "Grapes (Black)", category: "Fruits", price: 140, unit: "kg", stock: 18 },
  { id: "p308", shop_id: "s3", product_name: "Guava (Amrood)", category: "Fruits", price: 60, unit: "kg", stock: 25 },
  { id: "p309", shop_id: "s3", product_name: "Dragon Fruit", category: "Fruits", price: 250, unit: "kg", stock: 10 },
  { id: "p310", shop_id: "s3", product_name: "Kiwi", category: "Fruits", price: 300, unit: "kg", stock: 8 },
  { id: "p311", shop_id: "s3", product_name: "Sweet Lime (Mosambi)", category: "Fruits", price: 80, unit: "kg", stock: 30 },
  { id: "p312", shop_id: "s3", product_name: "Strawberry", category: "Fruits", price: 200, unit: "box", stock: 12 },
  { id: "p313", shop_id: "s3", product_name: "Chikoo (Sapota)", category: "Fruits", price: 100, unit: "kg", stock: 20 },
  { id: "p314", shop_id: "s3", product_name: "Pear (Nashpati)", category: "Fruits", price: 150, unit: "kg", stock: 15 },
  { id: "p315", shop_id: "s3", product_name: "Litchi", category: "Fruits", price: 180, unit: "kg", stock: 10 },
  { id: "p316", shop_id: "s3", product_name: "Fruit Chaat", category: "Chaat", price: 60, unit: "plate", stock: 30 },
  { id: "p317", shop_id: "s3", product_name: "Mango Shake", category: "Shakes", price: 80, unit: "glass", stock: 30 },
  { id: "p318", shop_id: "s3", product_name: "Orange Juice", category: "Juices", price: 60, unit: "glass", stock: 25 },

  // 8th Planet Confectionary - Sweets, Chocolates, Bakery & Snacks
  { id: "p54", shop_id: "s4", product_name: "Rasgulla", category: "Sweets", price: 30, unit: "piece", stock: 50 },
  { id: "p55", shop_id: "s4", product_name: "Gulab Jamun", category: "Sweets", price: 25, unit: "piece", stock: 60 },
  { id: "p56", shop_id: "s4", product_name: "Jalebi", category: "Sweets", price: 200, unit: "kg", stock: 20 },
  { id: "p57", shop_id: "s4", product_name: "Kaju Katli", category: "Sweets", price: 800, unit: "kg", stock: 10 },
  { id: "p58", shop_id: "s4", product_name: "Soan Papdi", category: "Sweets", price: 250, unit: "box", stock: 25 },
  { id: "p59", shop_id: "s4", product_name: "Barfi", category: "Sweets", price: 500, unit: "kg", stock: 15 },
  { id: "p60", shop_id: "s4", product_name: "Laddu", category: "Sweets", price: 400, unit: "kg", stock: 18 },
  { id: "p61", shop_id: "s4", product_name: "Chocolate Cake", category: "Bakery", price: 450, unit: "piece", stock: 8 },
  { id: "p62", shop_id: "s4", product_name: "Vanilla Pastry", category: "Bakery", price: 60, unit: "piece", stock: 30 },
  { id: "p63", shop_id: "s4", product_name: "Chocolate Pastry", category: "Bakery", price: 70, unit: "piece", stock: 28 },
  { id: "p64", shop_id: "s4", product_name: "Pineapple Cake", category: "Bakery", price: 500, unit: "piece", stock: 6 },
  { id: "p65", shop_id: "s4", product_name: "Butterscotch Cake", category: "Bakery", price: 480, unit: "piece", stock: 5 },
  { id: "p66", shop_id: "s4", product_name: "Dairy Milk Silk", category: "Chocolates", price: 150, unit: "piece", stock: 40 },
  { id: "p67", shop_id: "s4", product_name: "KitKat", category: "Chocolates", price: 50, unit: "piece", stock: 50 },
  { id: "p68", shop_id: "s4", product_name: "Ferrero Rocher (3pc)", category: "Chocolates", price: 180, unit: "box", stock: 20 },
  { id: "p69", shop_id: "s4", product_name: "5 Star", category: "Chocolates", price: 30, unit: "piece", stock: 60 },
  { id: "p70", shop_id: "s4", product_name: "Samosa", category: "Snacks", price: 15, unit: "piece", stock: 80 },
  { id: "p71", shop_id: "s4", product_name: "Kachori", category: "Snacks", price: 20, unit: "piece", stock: 50 },
  { id: "p72", shop_id: "s4", product_name: "Bread Pakora", category: "Snacks", price: 20, unit: "piece", stock: 40 },
  { id: "p73", shop_id: "s4", product_name: "Namkeen Mix", category: "Snacks", price: 100, unit: "pack", stock: 35 },

  // Three Sixty Stationary Shop - Full Stationery Range
  // Pens
  { id: "p74", shop_id: "s5", product_name: "Reynolds 045 Ball Pen", category: "Pens", price: 10, unit: "piece", stock: 200 },
  { id: "p75", shop_id: "s5", product_name: "Cello Butterflow Ball Pen", category: "Pens", price: 15, unit: "piece", stock: 180 },
  { id: "p76", shop_id: "s5", product_name: "Linc Glycer Ball Pen", category: "Pens", price: 12, unit: "piece", stock: 150 },
  { id: "p200", shop_id: "s5", product_name: "Pilot V5 Hi-Techpoint Pen", category: "Pens", price: 80, unit: "piece", stock: 60 },
  { id: "p201", shop_id: "s5", product_name: "Pentonic Gel Pen", category: "Pens", price: 20, unit: "piece", stock: 120 },
  { id: "p202", shop_id: "s5", product_name: "Uniball Eye Micro Pen", category: "Pens", price: 120, unit: "piece", stock: 40 },
  { id: "p203", shop_id: "s5", product_name: "Parker Vector Pen", category: "Pens", price: 250, unit: "piece", stock: 20 },
  { id: "p204", shop_id: "s5", product_name: "Trimax Gel Pen", category: "Pens", price: 25, unit: "piece", stock: 100 },
  { id: "p205", shop_id: "s5", product_name: "Hauser XO Ball Pen", category: "Pens", price: 15, unit: "piece", stock: 160 },
  { id: "p206", shop_id: "s5", product_name: "Flair Writo Meter Pen", category: "Pens", price: 20, unit: "piece", stock: 140 },
  // Notebooks / Registers
  { id: "p207", shop_id: "s5", product_name: "Classmate Notebook (Single Line)", category: "Notebooks", price: 45, unit: "piece", stock: 100 },
  { id: "p208", shop_id: "s5", product_name: "Classmate Notebook (Plain)", category: "Notebooks", price: 40, unit: "piece", stock: 90 },
  { id: "p209", shop_id: "s5", product_name: "Long Register", category: "Notebooks", price: 120, unit: "piece", stock: 50 },
  { id: "p210", shop_id: "s5", product_name: "Practical Record Notebook", category: "Notebooks", price: 80, unit: "piece", stock: 60 },
  { id: "p211", shop_id: "s5", product_name: "Drawing Notebook", category: "Notebooks", price: 60, unit: "piece", stock: 70 },
  { id: "p212", shop_id: "s5", product_name: "Hardbound Register", category: "Notebooks", price: 150, unit: "piece", stock: 30 },
  { id: "p213", shop_id: "s5", product_name: "Spiral Notebook", category: "Notebooks", price: 55, unit: "piece", stock: 80 },
  { id: "p214", shop_id: "s5", product_name: "Pocket Notebook", category: "Notebooks", price: 30, unit: "piece", stock: 100 },
  { id: "p215", shop_id: "s5", product_name: "Lab Record Book", category: "Notebooks", price: 90, unit: "piece", stock: 45 },
  { id: "p216", shop_id: "s5", product_name: "Graph Notebook", category: "Notebooks", price: 50, unit: "piece", stock: 75 },
  // Loose Pages & Paper
  { id: "p217", shop_id: "s5", product_name: "A4 Size Paper Bundle", category: "Loose Pages & Paper", price: 250, unit: "packet", stock: 40 },
  { id: "p218", shop_id: "s5", product_name: "A3 Drawing Sheets", category: "Loose Pages & Paper", price: 80, unit: "packet", stock: 35 },
  { id: "p219", shop_id: "s5", product_name: "Ruled Loose Sheets", category: "Loose Pages & Paper", price: 60, unit: "packet", stock: 50 },
  { id: "p220", shop_id: "s5", product_name: "Graph Papers", category: "Loose Pages & Paper", price: 40, unit: "packet", stock: 60 },
  { id: "p221", shop_id: "s5", product_name: "Printer Paper Pack", category: "Loose Pages & Paper", price: 350, unit: "packet", stock: 25 },
  { id: "p222", shop_id: "s5", product_name: "Colored Craft Paper", category: "Loose Pages & Paper", price: 50, unit: "packet", stock: 45 },
  { id: "p223", shop_id: "s5", product_name: "Chart Papers", category: "Loose Pages & Paper", price: 15, unit: "piece", stock: 100 },
  { id: "p224", shop_id: "s5", product_name: "Butter Paper", category: "Loose Pages & Paper", price: 30, unit: "packet", stock: 40 },
  { id: "p225", shop_id: "s5", product_name: "Sticky Notes Pads", category: "Loose Pages & Paper", price: 60, unit: "packet", stock: 80 },
  { id: "p226", shop_id: "s5", product_name: "Index Cards", category: "Loose Pages & Paper", price: 40, unit: "packet", stock: 50 },
  // Calculators
  { id: "p227", shop_id: "s5", product_name: "Casio FX-82MS Scientific Calculator", category: "Calculators", price: 800, unit: "piece", stock: 15 },
  { id: "p228", shop_id: "s5", product_name: "Casio FX-991ES Scientific Calculator", category: "Calculators", price: 1200, unit: "piece", stock: 10 },
  { id: "p229", shop_id: "s5", product_name: "Casio MJ-12D Basic Calculator", category: "Calculators", price: 400, unit: "piece", stock: 20 },
  { id: "p230", shop_id: "s5", product_name: "Casio DJ-120D Calculator", category: "Calculators", price: 600, unit: "piece", stock: 12 },
  { id: "p231", shop_id: "s5", product_name: "Orpat OT-512GT Calculator", category: "Calculators", price: 350, unit: "piece", stock: 18 },
  { id: "p232", shop_id: "s5", product_name: "Orpat OT-512 Basic Calculator", category: "Calculators", price: 250, unit: "piece", stock: 25 },
  { id: "p233", shop_id: "s5", product_name: "Citizen CT-500 Calculator", category: "Calculators", price: 450, unit: "piece", stock: 15 },
  { id: "p234", shop_id: "s5", product_name: "Flair Electronic Calculator", category: "Calculators", price: 300, unit: "piece", stock: 20 },
  { id: "p235", shop_id: "s5", product_name: "Casio FX-350ES Calculator", category: "Calculators", price: 900, unit: "piece", stock: 8 },
  { id: "p236", shop_id: "s5", product_name: "Pocket Calculator", category: "Calculators", price: 150, unit: "piece", stock: 30 },
  // Painting & Art Essentials
  { id: "p237", shop_id: "s5", product_name: "Camel Water Colours", category: "Painting & Art", price: 120, unit: "piece", stock: 30 },
  { id: "p238", shop_id: "s5", product_name: "Camel Oil Pastels", category: "Painting & Art", price: 100, unit: "packet", stock: 40 },
  { id: "p239", shop_id: "s5", product_name: "Poster Colours Set", category: "Painting & Art", price: 150, unit: "set", stock: 25 },
  { id: "p240", shop_id: "s5", product_name: "Acrylic Colour Set", category: "Painting & Art", price: 350, unit: "set", stock: 15 },
  { id: "p241", shop_id: "s5", product_name: "Paint Brushes Set", category: "Painting & Art", price: 80, unit: "set", stock: 35 },
  { id: "p242", shop_id: "s5", product_name: "Palette Tray", category: "Painting & Art", price: 40, unit: "piece", stock: 50 },
  { id: "p243", shop_id: "s5", product_name: "Canvas Board", category: "Painting & Art", price: 200, unit: "piece", stock: 20 },
  { id: "p244", shop_id: "s5", product_name: "Sketch Pencils Set", category: "Painting & Art", price: 180, unit: "set", stock: 25 },
  { id: "p245", shop_id: "s5", product_name: "Color Pencils (Faber Castell)", category: "Painting & Art", price: 250, unit: "packet", stock: 30 },
  { id: "p246", shop_id: "s5", product_name: "Crayons Set", category: "Painting & Art", price: 80, unit: "packet", stock: 45 },
  // Basic Stationery Tools
  { id: "p247", shop_id: "s5", product_name: "Scissors", category: "Stationery Tools", price: 50, unit: "piece", stock: 60 },
  { id: "p248", shop_id: "s5", product_name: "Glue Stick", category: "Stationery Tools", price: 30, unit: "piece", stock: 80 },
  { id: "p249", shop_id: "s5", product_name: "Fevicol Glue Bottle", category: "Stationery Tools", price: 40, unit: "piece", stock: 70 },
  { id: "p250", shop_id: "s5", product_name: "Paper Cutter", category: "Stationery Tools", price: 25, unit: "piece", stock: 50 },
  { id: "p251", shop_id: "s5", product_name: "Stapler", category: "Stationery Tools", price: 120, unit: "piece", stock: 30 },
  { id: "p252", shop_id: "s5", product_name: "Stapler Pins", category: "Stationery Tools", price: 20, unit: "packet", stock: 100 },
  { id: "p253", shop_id: "s5", product_name: "Tape Dispenser", category: "Stationery Tools", price: 80, unit: "piece", stock: 25 },
  { id: "p254", shop_id: "s5", product_name: "Transparent Tape", category: "Stationery Tools", price: 20, unit: "piece", stock: 120 },
  { id: "p255", shop_id: "s5", product_name: "Paper Clips Pack", category: "Stationery Tools", price: 15, unit: "packet", stock: 90 },
  { id: "p256", shop_id: "s5", product_name: "Binder Clips Pack", category: "Stationery Tools", price: 30, unit: "packet", stock: 60 },
  // Geometry Tools
  { id: "p257", shop_id: "s5", product_name: "Geometry Box", category: "Geometry Tools", price: 250, unit: "piece", stock: 30 },
  { id: "p258", shop_id: "s5", product_name: "Compass", category: "Geometry Tools", price: 50, unit: "piece", stock: 40 },
  { id: "p259", shop_id: "s5", product_name: "Divider", category: "Geometry Tools", price: 40, unit: "piece", stock: 35 },
  { id: "p260", shop_id: "s5", product_name: "Protractor", category: "Geometry Tools", price: 20, unit: "piece", stock: 60 },
  { id: "p261", shop_id: "s5", product_name: "Scale (15 cm)", category: "Geometry Tools", price: 10, unit: "piece", stock: 150 },
  { id: "p262", shop_id: "s5", product_name: "Scale (30 cm)", category: "Geometry Tools", price: 20, unit: "piece", stock: 100 },
  { id: "p263", shop_id: "s5", product_name: "Set Square", category: "Geometry Tools", price: 30, unit: "piece", stock: 50 },
  { id: "p264", shop_id: "s5", product_name: "Mechanical Pencil", category: "Geometry Tools", price: 40, unit: "piece", stock: 80 },
  { id: "p265", shop_id: "s5", product_name: "Lead Refill", category: "Geometry Tools", price: 15, unit: "packet", stock: 120 },
  { id: "p266", shop_id: "s5", product_name: "Eraser Pack", category: "Geometry Tools", price: 20, unit: "packet", stock: 100 },
  // Markers & Highlighters
  { id: "p267", shop_id: "s5", product_name: "Permanent Marker", category: "Markers & Highlighters", price: 30, unit: "piece", stock: 60 },
  { id: "p268", shop_id: "s5", product_name: "Whiteboard Marker", category: "Markers & Highlighters", price: 40, unit: "piece", stock: 50 },
  { id: "p269", shop_id: "s5", product_name: "Highlighter Yellow", category: "Markers & Highlighters", price: 25, unit: "piece", stock: 70 },
  { id: "p270", shop_id: "s5", product_name: "Highlighter Pink", category: "Markers & Highlighters", price: 25, unit: "piece", stock: 65 },
  { id: "p271", shop_id: "s5", product_name: "Highlighter Green", category: "Markers & Highlighters", price: 25, unit: "piece", stock: 60 },
  { id: "p272", shop_id: "s5", product_name: "CD/DVD Marker", category: "Markers & Highlighters", price: 35, unit: "piece", stock: 40 },
  { id: "p273", shop_id: "s5", product_name: "Sketch Pen Set", category: "Markers & Highlighters", price: 80, unit: "set", stock: 35 },
  { id: "p274", shop_id: "s5", product_name: "Calligraphy Pen Set", category: "Markers & Highlighters", price: 200, unit: "set", stock: 15 },
  { id: "p275", shop_id: "s5", product_name: "Brush Pen Set", category: "Markers & Highlighters", price: 250, unit: "set", stock: 12 },
  { id: "p276", shop_id: "s5", product_name: "Fabric Marker", category: "Markers & Highlighters", price: 45, unit: "piece", stock: 30 },
  // Office & School Supplies
  { id: "p277", shop_id: "s5", product_name: "File Folder", category: "Office & School Supplies", price: 30, unit: "piece", stock: 80 },
  { id: "p278", shop_id: "s5", product_name: "Plastic Document Folder", category: "Office & School Supplies", price: 40, unit: "piece", stock: 60 },
  { id: "p279", shop_id: "s5", product_name: "Ring Binder File", category: "Office & School Supplies", price: 100, unit: "piece", stock: 30 },
  { id: "p280", shop_id: "s5", product_name: "Clip Board", category: "Office & School Supplies", price: 80, unit: "piece", stock: 25 },
  { id: "p281", shop_id: "s5", product_name: "Envelope Pack", category: "Office & School Supplies", price: 50, unit: "packet", stock: 50 },
  { id: "p282", shop_id: "s5", product_name: "Visiting Card Holder", category: "Office & School Supplies", price: 120, unit: "piece", stock: 20 },
  { id: "p283", shop_id: "s5", product_name: "Desk Organizer", category: "Office & School Supplies", price: 250, unit: "piece", stock: 15 },
  { id: "p284", shop_id: "s5", product_name: "Pen Stand", category: "Office & School Supplies", price: 80, unit: "piece", stock: 30 },
  { id: "p285", shop_id: "s5", product_name: "Rubber Bands Pack", category: "Office & School Supplies", price: 20, unit: "packet", stock: 100 },
  { id: "p286", shop_id: "s5", product_name: "Label Stickers", category: "Office & School Supplies", price: 35, unit: "packet", stock: 70 },

  // Aman Fruit Shop - Fruits & Fruit Chaat
  { id: "p77", shop_id: "s6", product_name: "Apple", category: "Fruits", price: 180, unit: "kg", stock: 30 },
  { id: "p78", shop_id: "s6", product_name: "Banana", category: "Fruits", price: 40, unit: "dozen", stock: 50 },
  { id: "p400", shop_id: "s6", product_name: "Mango", category: "Fruits", price: 200, unit: "kg", stock: 25 },
  { id: "p401", shop_id: "s6", product_name: "Orange", category: "Fruits", price: 80, unit: "kg", stock: 35 },
  { id: "p402", shop_id: "s6", product_name: "Papaya", category: "Fruits", price: 60, unit: "kg", stock: 20 },
  { id: "p403", shop_id: "s6", product_name: "Pineapple", category: "Fruits", price: 50, unit: "piece", stock: 15 },
  { id: "p404", shop_id: "s6", product_name: "Watermelon", category: "Fruits", price: 30, unit: "kg", stock: 20 },
  { id: "p405", shop_id: "s6", product_name: "Muskmelon (Kharbuja)", category: "Fruits", price: 40, unit: "kg", stock: 18 },
  { id: "p406", shop_id: "s6", product_name: "Pomegranate (Anar)", category: "Fruits", price: 200, unit: "kg", stock: 15 },
  { id: "p407", shop_id: "s6", product_name: "Grapes (Green)", category: "Fruits", price: 120, unit: "kg", stock: 20 },
  { id: "p408", shop_id: "s6", product_name: "Grapes (Black)", category: "Fruits", price: 140, unit: "kg", stock: 18 },
  { id: "p409", shop_id: "s6", product_name: "Guava (Amrood)", category: "Fruits", price: 60, unit: "kg", stock: 25 },
  { id: "p410", shop_id: "s6", product_name: "Dragon Fruit", category: "Fruits", price: 250, unit: "kg", stock: 10 },
  { id: "p411", shop_id: "s6", product_name: "Kiwi", category: "Fruits", price: 300, unit: "kg", stock: 8 },
  { id: "p412", shop_id: "s6", product_name: "Sweet Lime (Mosambi)", category: "Fruits", price: 80, unit: "kg", stock: 30 },
  { id: "p413", shop_id: "s6", product_name: "Strawberry", category: "Fruits", price: 200, unit: "box", stock: 12 },
  { id: "p414", shop_id: "s6", product_name: "Chikoo (Sapota)", category: "Fruits", price: 100, unit: "kg", stock: 20 },
  { id: "p415", shop_id: "s6", product_name: "Pear (Nashpati)", category: "Fruits", price: 150, unit: "kg", stock: 15 },
  { id: "p416", shop_id: "s6", product_name: "Litchi", category: "Fruits", price: 180, unit: "kg", stock: 10 },
  { id: "p417", shop_id: "s6", product_name: "Fruit Chaat", category: "Chaat", price: 60, unit: "plate", stock: 30 },

  // Easy Grab General Store - Chips, Eggs & Egg Snacks
  { id: "p79", shop_id: "s7", product_name: "Lays Classic Salted", category: "Chips", price: 20, unit: "piece", stock: 80 },
  { id: "p80", shop_id: "s7", product_name: "Lays Cream & Onion", category: "Chips", price: 20, unit: "piece", stock: 75 },
  { id: "p81", shop_id: "s7", product_name: "Kurkure Masala Munch", category: "Chips", price: 20, unit: "piece", stock: 70 },
  { id: "p82", shop_id: "s7", product_name: "Kurkure Chilli Chatka", category: "Chips", price: 20, unit: "piece", stock: 65 },
  { id: "p83", shop_id: "s7", product_name: "Doritos Nacho Cheese", category: "Chips", price: 50, unit: "piece", stock: 30 },
  { id: "p84", shop_id: "s7", product_name: "Bingo Mad Angles", category: "Chips", price: 20, unit: "piece", stock: 60 },
  { id: "p85", shop_id: "s7", product_name: "Bingo Tedhe Medhe", category: "Chips", price: 20, unit: "piece", stock: 55 },
  { id: "p86", shop_id: "s7", product_name: "Uncle Chips Classic", category: "Chips", price: 20, unit: "piece", stock: 50 },
  { id: "p87", shop_id: "s7", product_name: "Too Yumm Chips", category: "Chips", price: 30, unit: "piece", stock: 40 },
  { id: "p88", shop_id: "s7", product_name: "Haldiram Aloo Bhujia", category: "Chips", price: 60, unit: "piece", stock: 35 },
  { id: "p89", shop_id: "s7", product_name: "Farm Fresh Eggs (6 Pack)", category: "Eggs & Egg Snacks", price: 50, unit: "pack", stock: 40 },
  { id: "p90", shop_id: "s7", product_name: "Farm Fresh Eggs (12 Pack)", category: "Eggs & Egg Snacks", price: 90, unit: "pack", stock: 30 },
  { id: "p91", shop_id: "s7", product_name: "Organic Eggs", category: "Eggs & Egg Snacks", price: 120, unit: "pack", stock: 15 },
  { id: "p92", shop_id: "s7", product_name: "Boiled Eggs", category: "Eggs & Egg Snacks", price: 15, unit: "piece", stock: 50 },
  { id: "p93", shop_id: "s7", product_name: "Egg Sandwich", category: "Eggs & Egg Snacks", price: 40, unit: "piece", stock: 25 },
  { id: "p94", shop_id: "s7", product_name: "Egg Puff", category: "Eggs & Egg Snacks", price: 30, unit: "piece", stock: 30 },
  { id: "p95", shop_id: "s7", product_name: "Egg Roll", category: "Eggs & Egg Snacks", price: 50, unit: "piece", stock: 20 },
  { id: "p96", shop_id: "s7", product_name: "Omelette Sandwich", category: "Eggs & Egg Snacks", price: 45, unit: "piece", stock: 22 },
  { id: "p97", shop_id: "s7", product_name: "Egg Mayo Sandwich", category: "Eggs & Egg Snacks", price: 55, unit: "piece", stock: 18 },
  { id: "p98", shop_id: "s7", product_name: "Egg Patties", category: "Eggs & Egg Snacks", price: 30, unit: "piece", stock: 35 },
];

export const demoOrders: Order[] = [
  { id: "o1", customer_name: "Priya Patel", customer_phone: "9876501234", shop_id: "s1", total_amount: 130, status: "Confirmed", timestamp: "2026-03-07T10:30:00", items: [
    { id: "oi1", order_id: "o1", product_id: "p1", product_name: "Cadbury Dairy Milk", quantity: 2, price: 100 },
    { id: "oi2", order_id: "o1", product_id: "p5", product_name: "Munch", quantity: 3, price: 30 },
  ]},
  { id: "o4", customer_name: "Ankit Kumar", customer_phone: "9876509876", shop_id: "s1", total_amount: 580, status: "Pending", timestamp: "2026-03-08T11:45:00", items: [
    { id: "oi8", order_id: "o4", product_id: "p12", product_name: "Chocolate Truffle Cake", quantity: 1, price: 500 },
    { id: "oi9", order_id: "o4", product_id: "p16", product_name: "Chocolate Pastry", quantity: 1, price: 80 },
  ]},
  { id: "o2", customer_name: "Arjun Reddy", customer_phone: "9876502345", shop_id: "s7", total_amount: 110, status: "Pending", timestamp: "2026-03-08T08:15:00", items: [
    { id: "oi3", order_id: "o2", product_id: "p79", product_name: "Lays Classic Salted", quantity: 3, price: 60 },
    { id: "oi4", order_id: "o2", product_id: "p89", product_name: "Farm Fresh Eggs (6 Pack)", quantity: 1, price: 50 },
  ]},
  { id: "o3", customer_name: "Priya Patel", customer_phone: "9876501234", shop_id: "s4", total_amount: 120, status: "Confirmed", timestamp: "2026-03-07T14:00:00", items: [
    { id: "oi6", order_id: "o3", product_id: "p54", product_name: "Coca Cola", quantity: 2, price: 80 },
    { id: "oi7", order_id: "o3", product_id: "p56", product_name: "Sprite", quantity: 1, price: 40 },
  ]},
];

export const demoSales: SalesEntry[] = [
  { id: "sl1", product_id: "p1", product_name: "Cadbury Dairy Milk", quantity: 40, date: "2026-03-01", price: 2000, shop_id: "s1" },
  { id: "sl2", product_id: "p3", product_name: "5 Star", quantity: 60, date: "2026-03-01", price: 1200, shop_id: "s1" },
  { id: "sl3", product_id: "p11", product_name: "Black Forest Pastry", quantity: 12, date: "2026-03-02", price: 960, shop_id: "s1" },
  { id: "sl4", product_id: "p21", product_name: "Amul Ice Cream", quantity: 25, date: "2026-03-02", price: 2000, shop_id: "s1" },
  { id: "sl5", product_id: "p41", product_name: "Veg Patties", quantity: 40, date: "2026-03-03", price: 1000, shop_id: "s2" },
  { id: "sl6", product_id: "p31", product_name: "White Bread", quantity: 30, date: "2026-03-03", price: 1200, shop_id: "s2" },
  { id: "sl7", product_id: "p54", product_name: "Coca Cola", quantity: 50, date: "2026-03-01", price: 2000, shop_id: "s4" },
  { id: "sl8", product_id: "p55", product_name: "Pepsi", quantity: 40, date: "2026-03-02", price: 1600, shop_id: "s4" },
  { id: "sl9", product_id: "p79", product_name: "Lays Classic Salted", quantity: 60, date: "2026-03-01", price: 1200, shop_id: "s7" },
  { id: "sl10", product_id: "p89", product_name: "Farm Fresh Eggs (6 Pack)", quantity: 35, date: "2026-03-02", price: 1750, shop_id: "s7" },
  { id: "sl11", product_id: "p51", product_name: "Mango Shake", quantity: 30, date: "2026-03-03", price: 2400, shop_id: "s3" },
  { id: "sl12", product_id: "p80", product_name: "Lays Cream & Onion", quantity: 55, date: "2026-03-04", price: 1100, shop_id: "s7" },
  { id: "sl13", product_id: "p12", product_name: "Chocolate Truffle Cake", quantity: 8, date: "2026-03-05", price: 4000, shop_id: "s1" },
  { id: "sl14", product_id: "p64", product_name: "Pintola Peanut Butter", quantity: 10, date: "2026-03-06", price: 3500, shop_id: "s4" },
  { id: "sl15", product_id: "p92", product_name: "Boiled Eggs", quantity: 45, date: "2026-03-07", price: 675, shop_id: "s7" },
];

export const demoPredictions = [
  { id: "pr1", product_name: "Milk (1L)", predicted_demand: 55, forecast_period: "Next Week", trend: "up" as const, confidence: 85 },
  { id: "pr2", product_name: "Bread", predicted_demand: 40, forecast_period: "Next Week", trend: "up" as const, confidence: 80 },
  { id: "pr3", product_name: "Tomato", predicted_demand: 30, forecast_period: "Next Week", trend: "up" as const, confidence: 75 },
  { id: "pr4", product_name: "Samosa", predicted_demand: 130, forecast_period: "Next Week", trend: "up" as const, confidence: 90 },
  { id: "pr5", product_name: "Chocolate Cake", predicted_demand: 4, forecast_period: "Next Week", trend: "down" as const, confidence: 70 },
  { id: "pr6", product_name: "Cappuccino", predicted_demand: 28, forecast_period: "Next Week", trend: "up" as const, confidence: 82 },
];

export const demoCallLogs: CallLog[] = [
  { id: "cl1", type: "robocall", caller_id: "system", receiver_id: "s1", caller_name: "Vendor+ System", receiver_name: "Big Bite Confectionary", masked_number: "+919012345678", call_duration: 22, timestamp: "2026-03-07T10:31:00", status: "completed", order_id: "o1", transcript: "You have received a new order on Vendor Plus. Customer Priya Patel has ordered: 1 Chocolate Cake, 4 Samosa. Total order value is 510 rupees. Press 1 to approve." },
  { id: "cl2", type: "robocall", caller_id: "system", receiver_id: "s4", caller_name: "Vendor+ System", receiver_name: "8th Planet Confectionary", masked_number: "+919012345679", call_duration: 18, timestamp: "2026-03-07T14:01:00", status: "completed", order_id: "o3", transcript: "You have received a new order on Vendor Plus. Customer Priya Patel has ordered: 2 Gulab Jamun, 1 Chocolate Cake. Total order value is 500 rupees. Press 1 to approve." },
  { id: "cl3", type: "masked", caller_id: "u3", receiver_id: "s1", caller_name: "Priya Patel", receiver_name: "Big Bite Confectionary", masked_number: "+919087654321", call_duration: 45, timestamp: "2026-03-07T11:00:00", status: "completed" },
  { id: "cl4", type: "masked", caller_id: "u3", receiver_id: "s7", caller_name: "Priya Patel", receiver_name: "Easy Grab General Store", masked_number: "+919087654322", call_duration: 30, timestamp: "2026-03-08T09:00:00", status: "completed" },
  { id: "cl5", type: "robocall", caller_id: "system", receiver_id: "s7", caller_name: "Vendor+ System", receiver_name: "Easy Grab General Store", masked_number: "+919012345680", call_duration: 0, timestamp: "2026-03-08T08:16:00", status: "initiated", order_id: "o2", transcript: "You have received a new order on Vendor Plus. Customer Arjun Reddy has ordered: 2 Milk, 1 Bread, 1 Samosa. Total order value is 175 rupees." },
];

export const areaData = [
  { area: "Bidholi Gate", demand: 92, topProducts: ["Samosa", "Chocolate Cake", "Gulab Jamun"], topShops: ["Big Bite Confectionary"], lat: 30.402, lng: 78.067 },
  { area: "UPES Campus", demand: 88, topProducts: ["Gulab Jamun", "Chocolate Cake"], topShops: ["8th Planet Confectionary"], lat: 30.405, lng: 78.069 },
  { area: "Bidholi Market", demand: 95, topProducts: ["Milk", "Bread", "Tomato"], topShops: ["Easy Grab General Store"], lat: 30.400, lng: 78.065 },
  { area: "Kandoli", demand: 75, topProducts: ["Jalebi", "Rasgulla"], topShops: ["Radhe Confectionary"], lat: 30.395, lng: 78.062 },
  { area: "Woodstock Hostel", demand: 80, topProducts: ["Maggi", "Samosa", "Tea"], topShops: ["Big Bite Confectionary"], lat: 30.407, lng: 78.070 },
  { area: "Maggie Point", demand: 72, topProducts: ["Maggi", "Bread Omelette", "Coffee"], topShops: ["Easy Grab General Store"], lat: 30.403, lng: 78.068 },
];
