CREATE DATABASE IF NOT EXISTS vinaeatery
	CHARACTER SET utf8mb4
	COLLATE utf8mb4_general_ci;
    
--  managers    
ALTER TABLE vinaeatery.managers		
ADD CONSTRAINT FK_managers_users FOREIGN KEY(user_id) REFERENCES users(id);
-- customers
ALTER TABLE vinaeatery.customers		
ADD CONSTRAINT FK_customers_users FOREIGN KEY(user_id) REFERENCES users(id);
-- restaurants
ALTER TABLE vinaeatery.restaurants		
ADD CONSTRAINT FK_restaurants_managers FOREIGN KEY(manager_id) REFERENCES managers(id);
-- use_tables
ALTER TABLE vinaeatery.use_tables
ADD CONSTRAINT FK_useTables_restaurants FOREIGN KEY(restaurant_id) REFERENCES restaurants(id);
ALTER TABLE vinaeatery.use_tables		
ADD CONSTRAINT FK_useTables_tables FOREIGN KEY(table_id) REFERENCES tables(id);
ALTER TABLE vinaeatery.use_tables
ADD CONSTRAINT FK_useTables_employees FOREIGN KEY(employee_id) REFERENCES employees(id);
ALTER TABLE vinaeatery.use_tables
ADD CONSTRAINT FK_useTables_customers FOREIGN KEY(customer_id) REFERENCES customers(id);
ALTER TABLE vinaeatery.use_tables
ADD CONSTRAINT FK_useTables_orders FOREIGN KEY(order_id) REFERENCES orders(id);
ALTER TABLE vinaeatery.use_tables
ADD CONSTRAINT FK_useTables_orderTables FOREIGN KEY(order_table_id) REFERENCES order_tables(id);
-- use_foods
ALTER TABLE vinaeatery.use_foods
ADD CONSTRAINT FK_useFoods_restaurants FOREIGN KEY(restaurant_id) REFERENCES restaurants(id);
ALTER TABLE vinaeatery.use_foods
ADD CONSTRAINT FK_useFoods_foods FOREIGN KEY(food_id) REFERENCES foods(id);
ALTER TABLE vinaeatery.use_foods
ADD CONSTRAINT FK_useFoods_employees FOREIGN KEY(employee_id) REFERENCES employees(id);
-- order_sheets
ALTER TABLE vinaeatery.order_sheets
ADD CONSTRAINT FK_orderSheets_restaurants FOREIGN KEY(restaurant_id) REFERENCES restaurants(id);
ALTER TABLE vinaeatery.order_sheets
ADD CONSTRAINT FK_orderSheets_employees FOREIGN KEY(employee_id) REFERENCES employees(id);
ALTER TABLE vinaeatery.order_sheets
ADD CONSTRAINT FK_orderSheets_tables FOREIGN KEY(table_id) REFERENCES tables(id);
-- order_sheet_details
ALTER TABLE vinaeatery.order_sheet_details
ADD CONSTRAINT FK_orderSheetDetails_orderSheets FOREIGN KEY(order_sheet_id) REFERENCES order_sheets(id);
ALTER TABLE vinaeatery.order_sheet_details
ADD CONSTRAINT FK_orderSheetDetails_foods FOREIGN KEY(food_id) REFERENCES foods(id);
-- messages
ALTER TABLE vinaeatery.messages
ADD CONSTRAINT FK_messages_restaurants FOREIGN KEY(restaurant_id) REFERENCES restaurants(id);
ALTER TABLE vinaeatery.messages
ADD CONSTRAINT FK_messages_useTables FOREIGN KEY(use_table_id) REFERENCES use_tables(id);
-- message_details
ALTER TABLE vinaeatery.message_details
ADD CONSTRAINT FK_messageDetails_messages FOREIGN KEY(message_id) REFERENCES messages(id);
-- orders
ALTER TABLE vinaeatery.orders
ADD CONSTRAINT FK_orders_restaurants FOREIGN KEY(restaurant_id) REFERENCES restaurants(id);
ALTER TABLE vinaeatery.orders
ADD CONSTRAINT FK_orders_employees FOREIGN KEY(employee_id) REFERENCES employees(id);
ALTER TABLE vinaeatery.orders
ADD CONSTRAINT FK_orders_customers FOREIGN KEY(customer_id) REFERENCES customers(id);
-- order_details
ALTER TABLE vinaeatery.order_details
ADD CONSTRAINT FK_orderDetails_orders FOREIGN KEY(order_id) REFERENCES orders(id);
ALTER TABLE vinaeatery.order_details
ADD CONSTRAINT FK_orderDetails_foods FOREIGN KEY(food_id) REFERENCES foods(id);
-- order_tables
ALTER TABLE vinaeatery.order_tables
ADD CONSTRAINT FK_orderTables_restaurants FOREIGN KEY(restaurant_id) REFERENCES restaurants(id);
ALTER TABLE vinaeatery.order_tables
ADD CONSTRAINT FK_orderTables_employees FOREIGN KEY(employee_id) REFERENCES employees(id);
ALTER TABLE vinaeatery.order_tables
ADD CONSTRAINT FK_orderTables_customers FOREIGN KEY(customer_id) REFERENCES customers(id);
-- floors
ALTER TABLE vinaeatery.floors		
ADD CONSTRAINT FK_floors_restaurants FOREIGN KEY(restaurant_id) REFERENCES restaurants(id);
-- category tables
ALTER TABLE vinaeatery.category_tables		
ADD CONSTRAINT FK_categoryTables_restaurants FOREIGN KEY(restaurant_id) REFERENCES restaurants(id);
-- tables
ALTER TABLE vinaeatery.tables		
ADD CONSTRAINT FK_tables_restaurants FOREIGN KEY(restaurant_id) REFERENCES restaurants(id);
ALTER TABLE vinaeatery.tables
ADD CONSTRAINT FK_foods_floors FOREIGN KEY(floor_id) REFERENCES floors(id);
ALTER TABLE vinaeatery.tables
ADD CONSTRAINT FK_foods_categoryTables FOREIGN KEY(category_table_id) REFERENCES category_tables(id);
-- input tickets
ALTER TABLE vinaeatery.input_tickets		
ADD CONSTRAINT FK_inputTickets_restaurants FOREIGN KEY(restaurant_id) REFERENCES restaurants(id);
ALTER TABLE vinaeatery.input_tickets
ADD CONSTRAINT FK_inputTickets_employees FOREIGN KEY(employee_id) REFERENCES employees(id);
ALTER TABLE vinaeatery.input_tickets
ADD CONSTRAINT FK_inputTickets_suppliers FOREIGN KEY(supplier_id) REFERENCES suppliers(id);
-- input ticket details
ALTER TABLE vinaeatery.input_ticket_details
ADD CONSTRAINT FK_inputTicketDetails_inputTickets FOREIGN KEY(input_ticket_id) REFERENCES input_tickets(id);
ALTER TABLE vinaeatery.input_ticket_details
ADD CONSTRAINT FK_inputTicketDetails_ingredients FOREIGN KEY(ingredient_id) REFERENCES ingredients(id);
-- category ingredients
ALTER TABLE vinaeatery.category_ingredients		
ADD CONSTRAINT FK_categoryIngredients_restaurants FOREIGN KEY(restaurant_id) REFERENCES restaurants(id);
-- ingredients
ALTER TABLE vinaeatery.ingredients		
ADD CONSTRAINT FK_ingredients_restaurants FOREIGN KEY(restaurant_id) REFERENCES restaurants(id);
ALTER TABLE vinaeatery.ingredients
ADD CONSTRAINT FK_ingredients_categoryIngredients FOREIGN KEY(category_ingredient_id) REFERENCES category_ingredients(id);
-- foods
ALTER TABLE vinaeatery.foods		
ADD CONSTRAINT FK_foods_restaurants FOREIGN KEY(restaurant_id) REFERENCES restaurants(id);
ALTER TABLE vinaeatery.foods
ADD CONSTRAINT FK_foods_categoryFoods FOREIGN KEY(category_food_id) REFERENCES category_foods(id);
-- recipes
ALTER TABLE vinaeatery.recipes
ADD CONSTRAINT FK_recipes_foods FOREIGN KEY(food_id) REFERENCES foods(id);
ALTER TABLE vinaeatery.recipes
ADD CONSTRAINT FK_recipes_ingredients FOREIGN KEY(ingredient_id) REFERENCES ingredients(id);
-- roles
ALTER TABLE vinaeatery.roles		
ADD CONSTRAINT FK_roles_restaurants FOREIGN KEY(restaurant_id) REFERENCES restaurants(id);
-- role_details
ALTER TABLE vinaeatery.role_details
ADD CONSTRAINT FK_roleDetails_roles FOREIGN KEY(role_id) REFERENCES roles(id);
ALTER TABLE vinaeatery.role_details
ADD CONSTRAINT FK_roleDetails_functions FOREIGN KEY(function_id) REFERENCES functions(id);
-- role_histories
ALTER TABLE vinaeatery.role_histories
ADD CONSTRAINT FK_roleHistories_employees FOREIGN KEY(employee_id) REFERENCES employees(id);
ALTER TABLE vinaeatery.role_histories
ADD CONSTRAINT FK_roleHistories_roles FOREIGN KEY(role_id) REFERENCES roles(id);
-- employees
ALTER TABLE vinaeatery.employees		
ADD CONSTRAINT FK_employees_restaurants FOREIGN KEY(restaurant_id) REFERENCES restaurants(id);
ALTER TABLE vinaeatery.employees		
ADD CONSTRAINT FK_employees_users FOREIGN KEY(user_id) REFERENCES users(id);
-- handle_payments
ALTER TABLE vinaeatery.handle_payments
ADD CONSTRAINT FK_handlePayments_useTables FOREIGN KEY(use_table_id) REFERENCES use_tables(id);
ALTER TABLE vinaeatery.handle_payments
ADD CONSTRAINT FK_handlePayments_employees FOREIGN KEY(employee_id) REFERENCES employees(id);
ALTER TABLE vinaeatery.handle_payments
ADD CONSTRAINT FK_handlePayments_payMethods FOREIGN KEY(pay_method_id) REFERENCES pay_methods(id);

INSERT INTO vinaeatery.pay_methods(id, image, name)
VALUES (1, "money-image.png", "Thanh toán bằng tiền mặt"),
	(2, "atm-logo.png", "Thanh toán bằng ngân hàng"),
    (3, "visa-master-jcb-logo.png", "Thanh toán bằng Visa/Master/JCB"),
    (4, "momo-logo.png", "Thanh toán ví MoMo"),
    (5, "zalopay-logo.png", "Thanh toán ví ZaloPay"),
    (6, "vnpay-logo.png", "Thanh toán bằng ví VNPay");

INSERT INTO vinaeatery.functions(id, name_vn, name_en, category, actions)
VALUES (1, "Thống kê Lợi nhuận", "dashboard-profit", "dashboard", "Xem"),
	(2, "Thống kê Đơn món ăn", "dashboard-orders", "dashboard", "Xem"),
	(3, "Thống kê Phiếu nhập", "dashboard-input-tickets", "dashboard", "Xem"),
	(4, "Lịch sử bàn ăn", "table-histories", "active", "Xem"),
    (5, "Sử dụng bàn ăn", "use-tables", "active", "Xem|Cập nhật"),
    (6, "Sử dụng món ăn", "use-foods", "active", "Xem|Cập nhật"),
    (7, "Gọi món ăn", "order-sheets", "active", "Xem|Cập nhật"),
    (8, "Trò chuyện", "messages", "active", "Xem|Thêm"),
    (9, "Đơn món ăn", "orders", "active", "Xem|Thêm|Cập nhật"),
    (10, "Đơn đặt bàn", "order-tables", "active", "Xem|Thêm|Cập nhật"),
    (11, "Thẻ khách hàng", "customer-cards", "customer", "Xem|Thêm|Cập nhật|Khóa"),
    (12, "Khách hàng", "customers", "customer", "Xem|Thêm|Cập nhật|Khóa"),
    (13, "Tầng", "floors", "seat", "Xem|Thêm|Cập nhật|Khóa"),
    (14, "Loại bàn ăn", "category-tables", "seat", "Xem|Thêm|Cập nhật|Khóa"),
    (15, "Bàn ăn", "tables", "seat", "Xem|Thêm|Cập nhật|Khóa"),
    (16, "Phiếu nhập", "input-tickets", "food", "Xem|Thêm|Cập nhật"),
    (17, "Nhà cung cấp", "suppliers", "food", "Xem|Thêm|Cập nhật|Khóa"),
    (18, "Loại nguyên liệu", "category-ingredients", "food", "Xem|Thêm|Cập nhật|Khóa"),
    (19, "Nguyên liệu", "ingredients", "food", "Xem|Thêm|Cập nhật|Khóa"),
    (20, "Loại món ăn", "category-foods", "food", "Xem|Thêm|Cập nhật|Khóa"),
    (21, "Món ăn", "foods", "food", "Xem|Thêm|Cập nhật|Khóa"),
    (22, "Chức vụ", "roles", "employee", "Xem|Thêm|Cập nhật|Khóa"),
    (23, "Nhân viên", "employees", "employee", "Xem|Thêm|Cập nhật|Khóa");

INSERT INTO vinaeatery.users(id, create_at, role, username, password, method, refresh_token, is_using, status, update_at)
VALUES (1, '2025-12-02 00:00:00', 'ADMIN', 'admin', '$2a$10$bhH/.jM0ks/qDcAhzFtKCO0b1LYyhTxF3lZrtxLVQ4KRWSbdhTRha', 'HANDMADE', NULL, 1, 1, NULL),
	(2, '2025-12-02 00:00:00', 'MANAGER', 'manager0', '$2a$10$JCdSVcRsSdWrIXlIA3nWFe5dnGydRYjoE33l7xr3YpxqrNxHnGQlG', 'HANDMADE', NULL, 1, 1, NULL),
    (3, '2025-12-02 00:00:00', 'MANAGER', 'manager1', '$2a$10$Y8zeMZCmycfAlk0ecbJnhepUDk1aTazZyAIbSS.3QdmdPSQNGTHDq', 'HANDMADE', NULL, 1, 1, NULL),
    (4, '2025-12-02 00:00:00', 'EMPLOYEE', 'employee0', '$2a$10$7rcbF5789gXaTvRqXmpFMe9srjpVvh5u64OvDK78WIJAAdlUqKq8m', 'HANDMADE', NULL, 1, 1, NULL),
    (5, '2025-12-02 00:00:00', 'EMPLOYEE', 'employee1', '$2a$10$NtuTmHa926tz6DyAv1/3b.L4pjE4tiWrAgPfXl/ohPIjK3dpz/dE2', 'HANDMADE', NULL, 1, 1, NULL),
    (6, '2025-12-02 00:00:00', 'EMPLOYEE', 'employee2', '$2a$10$JSQaUZ2U50IrDgYQisO3heahc1xISrhtQ423EViMXJus.I5cavY9S', 'HANDMADE', NULL, 1, 1, NULL),
    (7, '2025-12-02 00:00:00', 'EMPLOYEE', 'employee3', '$2a$10$jODPwwMUJ/73.kPmHhdXguyFbdt1dHV.ypHZzqfsKLY0w2e985y0u', 'HANDMADE', NULL, 1, 1, NULL),
    (8, '2025-12-02 00:00:00', 'EMPLOYEE', 'employee4', '$2a$10$GZ43yo1RYp7Yybl7AcvP8O9aV0fLffTJvNfuJyEX.o00gGYlZ/iuC', 'HANDMADE', NULL, 1, 1, NULL),
    (9, '2025-12-02 00:00:00', 'CUSTOMER', 'customer0', '$2a$10$aHFolHaNYoVtzX2PFL6/T.EA5Ak4ciPwkaFlFJft2HYbIrwxXtDC.', 'HANDMADE', NULL, 1, 1, NULL),
    (10, '2025-12-02 00:00:00', 'CUSTOMER', 'customer1', '$2a$10$IhIBM99z/aZD.6pQ5Oya.O6uMNAiUmS1/6AQuyX.wDmRTBbkFb7x.', 'HANDMADE', NULL, 1, 1, NULL);
    
INSERT INTO vinaeatery.managers(id, user_id, image, create_at, fullname, birthday, gender, phone, email, address, description, status, update_at)
VALUES (1, 2, NULL, '2025-12-02 00:00:00', 'Chủ cửa hàng Thanh Quy', NULL, NULL, '0000000001', 'thanhquy@gmail.com', '', NULL, 1, NULL),
	(2, 3, NULL, '2025-12-02 00:00:00', 'Chủ nhà hàng Phước Long', NULL, NULL, '0000000002', 'phuoclong@gmail.com', '', NULL, 1, NULL);
    
INSERT INTO vinaeatery.customers(id, user_id, image, create_at, fullname, birthday, gender, phone, email, address, description, status, update_at)
VALUES (1, 9, NULL, '2025-12-02 00:00:00', 'Trần Văn A', NULL, NULL, '0000000001', 'tranvana@gmail.com', '', 1, 1, NULL),
	(2, 10, NULL, '2025-12-02 00:00:00', 'Nguyễn Thị B', NULL, NULL, '0000000002', 'nguyenthib@gmail.com', '', NULL, 1, NULL);
    
INSERT INTO vinaeatery.restaurants(id, manager_id, create_at, name, phone, email, address, description, rating, status, update_at)
VALUES (1, 2, '2025-12-02 00:00:00', 'Nhà hàng Thanh Quy', '0000000000', 'thanhquy@gmail.com', '', NULL, 5, 1, NULL),
	(2, 2, '2025-12-02 00:00:00', 'Nhà hàng Phước Long', '0000000001', 'phuoclong@gmail.com', '', NULL, 4.5, 1, NULL);
    
INSERT INTO vinaeatery.roles(id, restaurant_id, name, salary, status, update_at)
VALUES (1, 1, "Quản lý", 20000000, 1, "2025-07-07 00:00:00"),
	(2, 1, "Quản lý vận hàng", 10000000, 1, "2025-07-07 00:00:00"),
    (3, 1, "Quản lý chỗ ngồi", 9000000, 1, "2025-07-07 00:00:00"),
    (4, 1, "Quản lý kho hàng", 9200000, 1, "2025-07-07 00:00:00"),
    (5, 1, "Quản lý nhân sự", 9500000, 1, "2025-07-07 00:00:00"),
    (6, 1, "Nhân viên phục vụ", 7000000, 1, "2025-07-07 00:00:00");
   
INSERT INTO vinaeatery.role_details(role_id, function_id, action)
VALUES (1, 1, "Xem"), (1, 2, "Xem"), (1, 3, "Xem"), (1, 4, "Xem"),
		(1, 5, "Xem"), (1, 5, "Cập nhật"),
		(1, 6, "Xem"), (1, 6, "Cập nhật"), 
        (1, 7, "Xem"), (1, 7, "Cập nhật"), 
        (1, 8, "Xem"), (1, 8, "Thêm"), 
		(1, 9, "Xem"), (1, 9, "Thêm"), (1, 9, "Cập nhật"),
		(1, 10, "Xem"), (1, 10, "Thêm"), (1, 10, "Cập nhật"),
		(1, 11, "Xem"), (1, 11, "Thêm"), (1, 11, "Cập nhật"), (1, 11, "Khóa"),
		(1, 12, "Xem"), (1, 12, "Thêm"), (1, 12, "Cập nhật"), (1, 12, "Khóa"),
        (1, 13, "Xem"), (1, 13, "Thêm"), (1, 13, "Cập nhật"), (1, 13, "Khóa"),
        (1, 14, "Xem"), (1, 14, "Thêm"), (1, 14, "Cập nhật"), (1, 14, "Khóa"),
        (1, 15, "Xem"), (1, 15, "Thêm"), (1, 15, "Cập nhật"), (1, 15, "Khóa"),
        (1, 16, "Xem"), (1, 16, "Thêm"), (1, 16, "Cập nhật"), 
        (1, 17, "Xem"), (1, 17, "Thêm"), (1, 17, "Cập nhật"), (1, 17, "Khóa"),
        (1, 18, "Xem"), (1, 18, "Thêm"), (1, 18, "Cập nhật"), (1, 18, "Khóa"),
        (1, 19, "Xem"), (1, 19, "Thêm"), (1, 19, "Cập nhật"), (1, 19, "Khóa"),
        (1, 20, "Xem"), (1, 20, "Thêm"), (1, 20, "Cập nhật"), (1, 20, "Khóa"),
        (1, 21, "Xem"), (1, 21, "Thêm"), (1, 21, "Cập nhật"), (1, 21, "Khóa"),
        (1, 22, "Xem"), (1, 22, "Thêm"), (1, 22, "Cập nhật"), (1, 22, "Khóa"),
		(1, 23, "Xem"), (1, 23, "Thêm"), (1, 23, "Cập nhật"), (1, 23, "Khóa"),
	(2, 2, "Xem"), (2, 4, "Xem"),
		(2, 5, "Xem"), (2, 5, "Cập nhật"),
		(2, 6, "Xem"), (2, 6, "Cập nhật"), 
        (2, 7, "Xem"), (2, 7, "Cập nhật"), 
        (2, 8, "Xem"), (2, 8, "Thêm"), 
		(2, 9, "Xem"), (2, 9, "Thêm"), (2, 9, "Cập nhật"),
		(2, 10, "Xem"), (2, 10, "Thêm"), (2, 10, "Cập nhật"),
	(3, 11, "Xem"), (3, 11, "Thêm"), (3, 11, "Cập nhật"), (3, 11, "Khóa"),
		(3, 12, "Xem"), (3, 12, "Thêm"), (3, 12, "Cập nhật"), (3, 12, "Khóa"),
	(4, 13, "Xem"), (4, 13, "Thêm"), (4, 13, "Cập nhật"), (4, 13, "Khóa"),
        (4, 14, "Xem"), (4, 14, "Thêm"), (4, 14, "Cập nhật"), (4, 14, "Khóa"),
		(4, 15, "Xem"), (4, 15, "Thêm"), (4, 15, "Cập nhật"), (4, 15, "Khóa"),
	(5, 3, "Xem"),
        (5, 16, "Xem"), (5, 16, "Thêm"), (5, 16, "Cập nhật"),
        (5, 17, "Xem"), (5, 17, "Thêm"), (5, 17, "Cập nhật"), (5, 17, "Khóa"),
        (5, 18, "Xem"), (5, 18, "Thêm"), (5, 18, "Cập nhật"), (5, 18, "Khóa"),
        (5, 19, "Xem"), (5, 19, "Thêm"), (5, 19, "Cập nhật"), (5, 19, "Khóa"),
        (5, 20, "Xem"), (5, 20, "Thêm"), (5, 20, "Cập nhật"), (5, 20, "Khóa"),
		(5, 21, "Xem"), (5, 21, "Thêm"), (5, 21, "Cập nhật"), (5, 21, "Khóa"),
	(6, 22, "Xem"), (6, 22, "Thêm"), (6, 22, "Cập nhật"), (6, 22, "Khóa"),
    	(6, 23, "Xem"), (6, 23, "Thêm"), (6, 23, "Cập nhật"), (6, 23, "Khóa");
    
INSERT INTO vinaeatery.employees(id, restaurant_id, user_id, create_at, image, date_begin, date_end, fullname, birthday, gender, phone, email, address, status, update_at)
VALUES (1, 1, 4, '2025-07-10', null, '2025-07-10', null, 'Quản lý', null, null, '0000000000', 'quanly@gmail.com', 'địa chỉ quản lý', 1, '2025-07-10'),
	(2, 1, 5, '2025-07-10', null, '2025-04-01', null, 'Quản lý vận hành', null, null, '0000000001', 'qlvanhanh@gmail.com', 'địa chỉ ql vận hành', 1, '2025-07-10'),
    (3, 1, 6, '2025-07-10', null, '2025-04-01', null, 'Quản lý chổ ngồi', null, null, '0000000002', 'qlchongoi@gmail.com', 'địa chỉ ql chổ ngồi', 1, '2025-07-10'),
	(4, 1, 7, '2025-07-10', null, '2025-04-01', null, 'Quản lý kho hàng', null, null, '0000000003', 'qlkhohang@gmail.com', 'địa chỉ ql kho hàng', 1, '2025-07-10'),
	(5, 1, 8, '2025-07-10', null, '2025-04-01', null, 'Quản lý nhân sự', null, null, '0000000004', 'qlnhansu@gmail.com', 'địa chỉ ql nhân sự', 1, '2025-07-10');
    
INSERT INTO vinaeatery.role_histories(employee_id, role_id, date_begin, date_end)
VALUES (1, 1, '2025-07-10', null),
	(2, 6, '2025-04-01', '2025-07-09'), (2, 2, '2025-07-10', null),
    (3, 6, '2025-05-01', '2025-07-09'), (3, 3, '2025-07-10', null),
    (4, 6, '2025-04-01', '2025-07-09'), (4, 4, '2025-07-10', null),
    (5, 5, '2025-07-10', null);

INSERT INTO vinaeatery.order_tables (
    id, restaurant_id, employee_id, customer_id, create_at, arrive_at, customer_fullname, customer_phone, customer_email, customer_note, guests, status, update_at
) VALUES (1, 1, null, 1, '2025-12-06 00:00:00', '2025-12-10 12:00:00', '1', '1111111111', '1@gmail.com', null, 4, 0, null),
	(2, 1, 1, 1, '2025-12-06 00:00:00', '2025-12-12 12:00:00', '2', '2222222222', '2@gmail.com', null, 2, 2, '2025-12-08 15:00:20'),
    (3, 1, 1, 1, '2025-12-06 00:00:00', '2025-12-15 12:00:00', '3', '3333333333', '3@gmail.com', null, 1, 1, '2025-12-09 09:28:34');
    
INSERT INTO vinaeatery.floors(id, restaurant_id, name, description, status, update_at)
VALUES (1, 1, 'Tầng 1', 'Sảnh chờ, nhà bếp, kho hàng...', 0, '2025-07-04 00:00:00'),
	(2, 1, 'Tầng 2', 'Khu ăn uống bình dân', 1, '2025-07-04 00:00:00'),
	(3, 1,'Tầng 3', 'Khu gia đình, yên tĩnh', 1, '2025-07-04 00:00:00'),
	(4, 1, 'Tầng 4', 'Khu VIP, máy lạnh đầy đủ', 1, '2025-07-04 00:00:00');
    
INSERT INTO vinaeatery.category_tables(id, restaurant_id, name, surcharge_type, surcharge_value, description, status, update_at)
VALUES (1, 1, 'Bàn thường', null, null, 'Bàn tiêu chuẩn không phụ thu', 1, '2025-07-03 08:30:00'),
	(2, 1, 'Bàn gần cửa sổ', 'Tiền cố định', 5, 'View đẹp, phụ thu 5% hóa đơn', 1, '2025-07-03 08:30:00'),
	(3, 1, 'Bàn VIP', 'Phần trăm hoá đơn', 100000, 'Không gian riêng tư, phụ thu cố định 100K', 1, '2025-07-03 08:30:00'),
	(4, 1, 'Phòng riêng thường', 'Tiền cố định', 200000, 'Phòng kín không có máy lạnh, phụ thu 200K/lượt', 1, '2025-07-03 08:30:00'),
	(5, 1, 'Phòng riêng Vip', 'Tiền cố định', 500000, 'Phòng kín có máy lạnh, phụ thu 500K/lượt', 1, '2025-07-03 08:30:00');

INSERT INTO vinaeatery.tables(id, restaurant_id, name, category_table_id, floor_id, seats, description, status, update_at)
VALUES (1, 1, 'Bàn T2-01', 1, 2, 4, 'Bàn tiêu chuẩn tầng 1', 1, '2025-07-04 10:00:00'),
	(2, 1, 'Bàn T2-02', 1, 2, 4, 'Bàn tiêu chuẩn tầng 1', 1, '2025-07-04 10:00:00'),
	(3, 1, 'Bàn T2-03', 2, 2, 4, 'Bàn gần cửa sổ tầng 1', 1, '2025-07-04 10:00:00'),
	(4, 1, 'Bàn T2-04', 2, 2, 6, 'Bàn gần cửa sổ tầng 1', 1, '2025-07-04 10:00:00'),
	(5, 1, 'Bàn T2-05', 1, 2, 2, 'Bàn nhỏ tầng 1', 1, '2025-07-04 10:00:00'),
	(6, 1, 'Bàn T2-06', 1, 2, 4, 'Bàn tiêu chuẩn tầng 1', 1, '2025-07-04 10:00:00'),
	(7, 1, 'Bàn T2-07', 1, 2, 4, 'Bàn tiêu chuẩn tầng 1', 1, '2025-07-04 10:00:00'),
	(8, 1, 'Bàn T2-08', 2, 2, 4, 'Bàn gần cửa sổ tầng 1', 1, '2025-07-04 10:00:00'),
	(9, 1, 'Bàn T2-09', 1, 2, 6, 'Bàn lớn tầng 1', 1, '2025-07-04 10:00:00'),
	(10, 1, 'Bàn T2-10', 1, 2, 4, 'Bàn tiêu chuẩn tầng 1', 1, '2025-07-04 10:00:00'),
	(11, 1, 'Bàn T3-01', 3, 3, 4, 'Bàn VIP tầng 2', 1, '2025-07-04 10:00:00'),
	(12, 1, 'Bàn T3-02', 3, 3, 6, 'Bàn VIP tầng 2', 1, '2025-07-04 10:00:00'),
	(13, 1, 'Bàn T3-03', 3, 3, 4, 'Bàn VIP tầng 2', 1, '2025-07-04 10:00:00'),
	(14, 1, 'Bàn T3-04', 3, 3, 6, 'Bàn VIP tầng 2', 1, '2025-07-04 10:00:00'),
	(15, 1, 'Bàn T3-05', 3, 3, 4, 'Bàn VIP tầng 2', 1, '2025-07-04 10:00:00'),
	(16, 1, 'Bàn T3-06', 3, 3, 6, 'Bàn VIP tầng 2', 1, '2025-07-04 10:00:00'),
	(17, 1, 'Bàn T3-07', 3, 3, 4, 'Bàn VIP tầng 2', 1, '2025-07-04 10:00:00'),
	(18, 1, 'Bàn T3-08', 3, 3, 6, 'Bàn VIP tầng 2', 1, '2025-07-04 10:00:00'),
	(19, 1, 'Bàn T3-09', 3, 3, 4, 'Bàn VIP tầng 2', 1, '2025-07-04 10:00:00'),
	(20, 1, 'Bàn T3-10', 3, 3, 6, 'Bàn VIP tầng 2', 1, '2025-07-04 10:00:00'),
	(21, 1, 'Bàn T4-01', 4, 4, 6, 'Phòng riêng tầng 3', 1, '2025-07-04 10:00:00'),
	(22, 1, 'Bàn T4-02', 4, 4, 8, 'Phòng riêng tầng 3', 1, '2025-07-04 10:00:00'),	
	(23, 1, 'Bàn T4-03', 5, 4, 10,'Phòng riêng VIP tầng 3', 1, '2025-07-04 10:00:00'),
	(24, 1, 'Bàn T4-04', 4, 4, 6, 'Phòng riêng tầng 3', 1, '2025-07-04 10:00:00'),
	(25, 1, 'Bàn T4-05', 4, 4, 8, 'Phòng riêng tầng 3', 1, '2025-07-04 10:00:00'),
	(26, 1, 'Bàn T4-06', 5, 4, 6, 'Phòng riêng VIP tầng 3', 1, '2025-07-04 10:00:00'),
	(27, 1, 'Bàn T4-07', 4, 4, 8, 'Phòng riêng tầng 3', 1, '2025-07-04 10:00:00'),
	(28, 1, 'Bàn T4-08', 4, 4, 10,'Phòng riêng lớn tầng 3', 1, '2025-07-04 10:00:00'),
	(29, 1, 'Bàn T4-09', 4, 4, 6, 'Phòng riêng tầng 3', 1, '2025-07-04 10:00:00'),
	(30, 1, 'Bàn T4-10', 4, 4, 8, 'Phòng riêng tầng 3', 1, '2025-07-04 10:00:00');

INSERT INTO vinaeatery.suppliers(id, restaurant_id, name, phone, email, address, status, update_at)
VALUES (1, 1, 'Công ty TNHH Thực Phẩm Sạch Việt', '0909123456', 'contact@thucphamsachviet.vn', '123 Đường Nguyễn Trãi, Phường 5, TP.HCM', 1, '2025-04-18 10:00:00'),
	(2, 1, 'Công ty Cổ phần Rau Quả Miền Bắc', '0912345678', 'info@rauquamn.vn', '45 Lê Văn Lương, Phường Nhân Chính, Hà Nội', 1, '2025-04-18 10:05:00'),
	(3, 1, 'Công ty TNHH Nông Sản An Tâm', '0988765432', 'support@antamfoods.vn', '88 Trường Chinh, Phường Phương Mai, Hà Nội', 1, '2025-04-18 10:10:00'),
	(4, 1, 'Công ty TNHH Thủy Hải Sản Biển Đông', '0933555777', 'sales@biendongseafood.vn', '12 Võ Văn Kiệt, Phường Nguyễn Thái Bình, TP.HCM', 1, '2025-04-18 10:15:00'),
	(5, 1, 'HTX Nông nghiệp Hữu cơ Đồng Xanh', '0944666888', 'dongxanhorganic@gmail.com', 'Ấp 3, Xã Tân Phú Trung, TP.HCM', 1, '2025-04-18 10:20:00'),
	(6, 1, 'Công ty TNHH Gạo Sạch An Khang', '0977111222', 'gaosach@ankhang.vn', 'Số 10, Đường Tỉnh Lộ 10, Phường Tân Tạo, TP.HCM', 1, '2025-04-18 10:25:00'),
	(7, 1, 'Công ty TNHH Trái Cây Nam Bộ', '0909888777', 'fruit.south@traicaynb.vn', 'Số 5, QL1A, Phường 10, TP. Mỹ Tho, Tiền Giang', 1, '2025-04-18 10:30:00'),
	(8, 1, 'HTX Rau Sạch Đà Lạt Xanh', '0966333444', 'daxanh.rau@gmail.com', 'Thôn Trạm Hành, Xã Trạm Hành, TP. Đà Lạt, Lâm Đồng', 1, '2025-04-18 10:35:00'),
	(9, 1, 'Công ty TNHH Nước Mắm Phú Quốc', '0933222111', 'phuquocfishsauce@gmail.com', 'Tổ 1, Phường Dương Đông, TP. Phú Quốc, Kiên Giang', 1, '2025-04-18 10:40:00'),
	(10, 1, 'Công ty TNHH Mật Ong Rừng Tây Bắc', '0988999000', 'matongtaybac@gmail.com', 'Bản Hua Tát, Xã Chiềng Hắc, Mộc Châu, Sơn La', 1, '2025-04-18 10:45:00'),
	(11, 1, 'Công ty TNHH Thực Phẩm Đông Lạnh Hà Nội', '0922333444', 'coldfood@hanoi.vn', 'Km10, Quốc lộ 32, Phường Phúc Diễn, Hà Nội', 0, '2025-04-18 10:50:00'),
	(12, 1, 'Công ty Cổ phần Thực phẩm đóng hộp', '0955111222', 'pending@supplier.com', 'Số 9, Nguyễn Hữu Thọ, Phường Khuê Trung, Đà Nẵng', 0, '2025-04-18 10:55:00'),
	(13, 1, 'Công ty TNHH Bột Mì Bình An', '0909777666', 'botmi@binhan.vn', 'KCN Tân Tạo, Phường Tân Tạo A, TP.HCM', 1, '2025-04-18 11:00:00'),
	(14, 1, 'HTX Trứng Gà Sạch Hòa Bình', '0912666111', 'trungga@hoabinh.vn', 'Xã Dân Chủ, TP. Hòa Bình', 1, '2025-04-18 11:05:00'),
	(15, 1, 'Công ty TNHH Dầu Ăn Thực Vật Việt', '0922111000', 'dau.an@thucvatviet.vn', 'Đường số 7, Phường Dĩ An, Bình Dương', 1, '2025-04-18 11:10:00'),
	(16, 1, 'Công ty TNHH Thực Phẩm Hữu Cơ Mekong', '0933444555', 'mekongorganic@gmail.com', 'QL91, Phường Mỹ Thới, TP. Long Xuyên, An Giang', 1, '2025-04-18 11:15:00'),
	(17, 1, 'Công ty TNHH Muối Biển Việt', '0944222333', 'muoi@bienviet.vn', 'Xã Cồn Vạn, Nam Định', 1, '2025-04-18 11:20:00'),
	(18, 1, 'HTX Đậu Phụ Sạch Hà Nội', '0977333444', 'dauphu@hanoisoy.vn', 'Thôn Yên Mỹ, Xã Tam Hiệp, Hà Nội', 1, '2025-04-18 11:25:00'),
	(19, 1, 'Công ty Cổ phần Nông Sản Tây Nguyên', '0988111777', 'nongsan@taynguyen.vn', 'Phường Tân Lợi, TP. Buôn Ma Thuột, Đắk Lắk', 1, '2025-04-18 11:30:00'),
	(20, 1, 'HTX Hành Tím Vĩnh Châu', '0966444777', 'hanhtim@vinhchau.vn', 'Xã Vĩnh Hải, TP. Vĩnh Châu, Sóc Trăng', 1, '2025-04-18 11:35:00');
    
INSERT INTO vinaeatery.category_ingredients(id, restaurant_id, name, description, status)
VALUES (1, 1, 'Thịt đỏ', 'Thịt heo, bò, dê, trâu... giàu đạm và sắt', 1),
	(2, 1, 'Thịt trắng', 'Thịt gà, vịt, ngan... ít béo, dễ tiêu hóa', 1),
	(3, 1, 'Hải sản', 'Tôm, cua, cá, mực, nghêu, sò... từ biển và sông', 1),
	(4, 1, 'Trứng & Sữa', 'Trứng gia cầm, sữa tươi, sữa đặc, phô mai...', 1),
	(5, 1, 'Rau ăn lá', 'Rau muống, cải thìa, cải ngọt, rau dền...', 1),
	(6, 1, 'Củ quả', 'Cà rốt, khoai tây, hành tây, su su, bí đỏ...', 1),
	(7, 1, 'Gia vị khô', 'Muối, tiêu, đường, bột ngọt, hạt nêm...', 1),
	(8, 1, 'Gia vị ướt', 'Nước mắm, nước tương, dầu hào, giấm, tương ớt...', 1),
	(9, 1, 'Dầu mỡ', 'Dầu ăn, mỡ heo, dầu mè, bơ...', 1),
	(10, 1, 'Đậu & Nấm', 'Đậu hũ, nấm rơm, nấm mèo, nấm kim châm...', 1),
	(11, 1, 'Tinh bột', 'Bột mì, bột năng, bột bắp, bún, mì, cơm...', 1),
	(12, 1, 'Thực phẩm khô', 'Miến khô, nấm khô, mộc nhĩ, rong biển...', 1),
	(13, 1, 'Thảo mộc & Lá', 'Lá chanh, sả, gừng, quế, hồi, rau thơm...', 1);
    
INSERT INTO vinaeatery.ingredients(
	id, restaurant_id, name, category_ingredient_id, unit, capacity, date_create, date_remove, input_price, inventory, note, status, update_at
)
VALUES (1, 1, 'Thịt heo ba rọi', 1, 'kg', 1, '2025-07-01 10:00:00', null, 95000, 20, 'Dùng kho hoặc nướng', 1, '2025-07-01 10:00:00'),
	(2, 1, 'Thịt bò thăn', 1, 'kg', 1, '2025-07-01 10:01:00', null, 230000, 10, 'Dùng áp chảo hoặc xào', 1, '2025-07-01 10:01:00'),
	(3, 1, 'Thịt dê', 1, 'kg', 1, '2025-07-01 10:02:00', null, 190000, 5, 'Làm lẩu hoặc nướng ngũ vị', 1, '2025-07-01 10:02:00'),
	(4, 1, 'Ức gà phi lê', 2, 'kg', 1, '2025-07-01 10:05:00', null, 85000, 15, 'Dùng xào hoặc salad', 1, '2025-07-01 10:05:00'),
	(5, 1, 'Đùi vịt', 2, 'kg', 1, '2025-07-01 10:06:00', null, 125000, 10, 'Dùng nấu măng hoặc quay', 1, '2025-07-01 10:06:00'),
	(6, 1, 'Tôm sú', 3, 'kg', 1, '2025-07-01 10:10:00', null, 180000, 10, 'Hấp, xào hoặc nấu canh', 1, '2025-07-01 10:10:00'),
	(7, 1, 'Mực ống', 3, 'kg', 1, '2025-07-01 10:11:00', null, 150000, 8, 'Xào cay hoặc chiên giòn', 1, '2025-07-01 10:11:00'),
	(8, 1, 'Cá basa phi lê', 3, 'kg', 1, '2025-07-01 10:12:00', null, 65000, 12, 'Dùng nấu lẩu hoặc chiên sả ớt', 1, '2025-07-01 10:12:00'),
	(9, 1, 'Trứng gà ta', 4, 'quả', 1, '2025-07-01 10:15:00', null, 5000, 100, 'Chiên, hấp, kho, tạo kết dính', 1, '2025-07-01 10:15:00'),
	(10, 1, 'Sữa đặc', 4, 'ml', 380, '2025-07-01 10:16:00', null, 15000, 25, 'Làm sốt hoặc pha nước chấm', 1, '2025-07-01 10:16:00'),
	(11, 1, 'Cải thìa', 5, 'kg', 1, '2025-07-01 10:20:00', null, 25000, 12, 'Luộc hoặc xào tỏi', 1, '2025-07-01 10:20:00'),
	(12, 1, 'Rau muống', 5, 'kg', 1, '2025-07-01 10:21:00', null, 18000, 18, 'Xào tỏi, ăn lẩu', 1, '2025-07-01 10:21:00'),
	(13, 1, 'Cà rốt', 6, 'kg', 1, '2025-07-01 10:25:00', null, 18000, 18, 'Tạo màu và vị ngọt tự nhiên', 1, '2025-07-01 10:25:00'),
	(14, 1, 'Khoai tây', 6, 'kg', 1, '2025-07-01 10:26:00', null, 22000, 14, 'Chiên, nấu súp, ninh', 1, '2025-07-01 10:26:00'),
	(15, 1, 'Muối hột', 7, 'g', 500, '2025-07-01 10:30:00', null, 3000, 50, 'Nêm nếm cơ bản', 1, '2025-07-01 10:30:00'),
	(16, 1, 'Đường cát trắng', 7, 'g', 1000, '2025-07-01 10:31:00', null, 10000, 40, 'Tạo vị ngọt, làm caramel', 1, '2025-07-01 10:31:00'),
	(17, 1, 'Nước mắm Nam Ngư', 8, 'ml', 500, '2025-07-01 10:35:00', null, 18000, 30, 'Nước chấm hoặc ướp', 1, '2025-07-01 10:35:00'),
	(18, 1, 'Dầu hào', 8, 'ml', 450, '2025-07-01 10:36:00', null, 21000, 20, 'Tạo độ bóng và vị mặn ngọt', 1, '2025-07-01 10:36:00'),
	(19, 1, 'Dầu ăn Tường An', 9, 'ml', 1000, '2025-07-01 10:40:00', null, 45000, 25, 'Chiên, xào', 1, '2025-07-01 10:40:00'),
	(20, 1, 'Bơ thực vật', 9, 'g', 200, '2025-07-01 10:41:00', null, 12000, 10, 'Tạo mùi thơm và béo cho món Âu', 1, '2025-07-01 10:41:00'),
	(21, 1, 'Đậu hũ trắng', 10, 'miếng', 1, '2025-07-01 10:45:00', null, 3000, 60, 'Kho, chiên, xào', 1, '2025-07-01 10:45:00'),
	(22, 1, 'Nấm kim châm', 10, 'g', 150, '2025-07-01 10:46:00', null, 15000, 8, 'Dùng lẩu hoặc xào chay', 1, '2025-07-01 10:46:00'),
	(23, 1, 'Bún tươi', 11, 'g', 500, '2025-07-01 10:50:00', null, 10000, 20, 'Ăn cùng nước lèo hoặc thịt nướng', 1, '2025-07-01 10:50:00'),
	(24, 1, 'Mì trứng khô', 11, 'g', 300, '2025-07-01 10:51:00', null, 8000, 25, 'Luộc, xào, làm mì nước', 1, '2025-07-01 10:51:00'),
	(25, 1, 'Miến dong khô', 12, 'g', 200, '2025-07-01 10:55:00', null, 12000, 15, 'Ngâm nước rồi nấu canh hoặc xào', 1, '2025-07-01 10:55:00'),
	(26, 1, 'Rong biển khô', 12, 'g', 100, '2025-07-01 10:56:00', null, 15000, 10, 'Làm canh rong biển', 1, '2025-07-01 10:56:00'),
	(27, 1, 'Lá chanh', 13, 'g', 50, '2025-07-01 11:00:00', null, 7000, 10, 'Khử mùi, tạo hương thơm', 1, '2025-07-01 11:00:00'),
	(28, 1, 'Sả cây', 13, 'cây', 1, '2025-07-01 11:01:00', null, 2000, 30, 'Dùng ướp, nấu lẩu', 1, '2025-07-01 11:01:00'),
	(29, 1, 'Gừng tươi', 13, 'g', 100, '2025-07-01 11:02:00', null, 6000, 20, 'Khử mùi tanh và tăng hương vị', 1, '2025-07-01 11:02:00'),
	(30, 1, 'Phô mai lát', 4, 'miếng', 1, '2025-07-01 11:05:00', null, 5000, 40, 'Làm topping cho mì, bánh mì', 1, '2025-07-01 11:05:00');
    
INSERT INTO vinaeatery.input_tickets(id, restaurant_id, create_at, employee_id, supplier_id, total_price, pay_status, status)
VALUES (1, 1, '2025-03-22 08:17:22', 1, 2, 11350000, 1, 3),
	(2, 1, '2025-04-01 08:17:22', 5, 2, 28559000, 0, 0),
	(3, 1, '2025-03-23 08:17:22', 5, 1, 6745000, 0, 1),
	(4, 1, '2025-04-01 08:17:22', 5, 3, 20784000, 1, 1),
	(5, 1, '2025-03-23 08:17:22', 5, 7, 26871000, 1, 2),
	(6, 1, '2025-04-02 08:17:22', 1, 5, 3829000, 1, 2),
	(7, 1, '2025-03-24 08:17:22', 1, 5, 10476000, 1, 3),
	(8, 1, '2025-04-03 08:17:22', 1, 7, 10844000, 0, 0),
	(9, 1, '2025-03-25 08:17:22', 5, 6, 17889000, 0, 2),
	(10, 1, '2025-04-03 08:17:22', 1, 8, 9670000, 0, 1),
	(11, 1, '2025-03-26 08:17:22', 5, 8, 16810000, 1, 3),
	(12, 1, '2025-04-04 08:17:22', 5, 6, 3645000, 0, 0),
	(13, 1, '2025-03-27 08:17:22', 1, 10, 26247000, 1, 2),
	(14, 1, '2025-04-05 08:17:22', 5, 9, 9615000, 0, 3),
	(15, 1, '2025-03-28 08:17:22', 1, 11, 893000, 0, 0),
	(16, 1, '2025-04-06 08:17:22', 1, 11, 11399000, 0, 3),
	(17, 1, '2025-03-29 08:17:22', 5, 3, 3760000, 0, 0),
	(18, 1, '2025-04-07 08:17:22', 1, 7, 7288000, 1, 2),
	(19, 1, '2025-03-30 08:17:22', 5, 4, 15741000, 0, 1),
	(20, 1, '2025-04-08 08:17:22', 5, 3, 22902000, 0, 2),
	(21, 1, '2025-03-31 08:17:22', 1, 2, 3573000, 0, 0),
	(22, 1, '2025-04-09 08:17:22', 5, 3, 10366000, 1, 0);
    
INSERT INTO vinaeatery.input_ticket_details(input_ticket_id, ingredient_id, price, quantity)
VALUES (1, 1, 95000, 50), (1, 2, 230000, 20), (1, 13, 18000, 50), (1, 14, 22000, 50),
	(2, 5, 125000, 31), (2, 6, 180000, 77), (2, 7, 150000, 58), (2, 13, 18000, 58), (2, 12, 18000, 60),
	(3, 14, 22000, 23), (3, 4, 85000, 26), (3, 18, 21000, 74), (3, 19, 45000, 55),
	(4, 12, 18000, 36), (4, 6, 180000, 52), (4, 7, 150000, 59), (4, 17, 18000, 57), (4, 20, 12000, 75),
	(5, 18, 21000, 42), (5, 3, 190000, 93), (5, 10, 15000, 66), (5, 5, 125000, 53), (5, 14, 22000, 32),
	(6, 11, 25000, 28), (6, 12, 18000, 48), (6, 1, 95000, 10), (6, 9, 5000, 97), (6, 16, 10000, 83),
	(7, 6, 180000, 48), (7, 17, 18000, 47), (7, 12, 18000, 55),
	(8, 19, 45000, 83), (8, 5, 125000, 36), (8, 8, 65000, 13), (8, 18, 21000, 84),
	(9, 15, 3000, 60), (9, 12, 18000, 43), (9, 4, 85000, 87), (9, 6, 180000, 53),
	(10, 19, 45000, 85), (10, 17, 18000, 25), (10, 1, 95000, 53), (10, 12, 18000, 20),
	(11, 4, 85000, 89), (11, 8, 65000, 37), (11, 6, 180000, 38),
	(12, 13, 18000, 68), (12, 9, 5000, 21), (12, 17, 18000, 97), (12, 10, 15000, 38),
	(13, 3, 190000, 98), (13, 15, 3000, 29), (13, 8, 65000, 60), (13, 19, 45000, 42), (13, 11, 25000, 70),
	(14, 2, 230000, 21), (14, 18, 21000, 20), (14, 19, 45000, 97),
	(15, 15, 3000, 23), (15, 17, 18000, 33), (15, 16, 10000, 23),
	(16, 16, 10000, 66), (16, 8, 65000, 43), (16, 13, 18000, 67), (16, 7, 150000, 34), (16, 18, 21000, 78),
	(17, 9, 5000, 48), (17, 11, 25000, 29), (17, 8, 65000, 43),
	(18, 7, 150000, 42), (18, 14, 22000, 34), (18, 9, 5000, 48),
	(19, 15, 3000, 67), (19, 1, 95000, 82), (19, 5, 125000, 56), (19, 10, 15000, 50),
	(20, 5, 125000, 92), (20, 18, 21000, 72), (20, 10, 15000, 51), (20, 7, 150000, 59), (20, 11, 25000, 11),
	(21, 9, 5000, 53), (21, 12, 18000, 36), (21, 1, 95000, 28),
	(22, 2, 230000, 41), (22, 17, 18000, 29), (22, 15, 3000, 18), (22, 20, 12000, 30);
    
INSERT INTO vinaeatery.category_foods(id, restaurant_id, image, name, description, status, update_at)
VALUES (1, 1, null, 'Khai vị', 'Các món ăn nhẹ như gỏi, súp, chả giò dùng để khai vị.', 1, '2025-07-01 20:00:00'),
	(2, 1, null, 'Món chính', 'Các món ăn chính như cơm, bún, phở, lẩu,...', 1, '2025-07-01 20:05:00'),
	(3, 1, null, 'Tráng miệng', 'Các món ngọt hoặc trái cây dùng sau bữa ăn.', 1, '2025-07-01 20:10:00'),
	(4, 1, null, 'Thức uống', 'Nước ngọt, bia, rượu, sinh tố, nước ép,...', 1, '2025-07-01 20:15:00'),
	(5, 1, null, 'Món chay', 'Món ăn chay sử dụng nguyên liệu từ thực vật.', 1, '2025-06-28 19:00:00'),
	(6, 1, null, 'Salad', 'Các món rau trộn nhiều loại sốt đa dạng.', 1, '2025-07-01 19:30:00'),
	(7, 1, null, 'Mì & Bún', 'Món mì, bún xào, bún nước, hủ tiếu,...', 1, '2025-07-01 20:20:00'),
	(8, 1, null, 'Lẩu', 'Các món lẩu đa dạng như lẩu thái, lẩu nấm, lẩu bò,...', 1, '2025-07-01 20:25:00'),
	(9, 1, null, 'Đồ nướng', 'Các món nướng như thịt nướng, hải sản nướng,...', 1, '2025-07-01 20:30:00'),
	(10, 1, null, 'Đồ chiên', 'Các món chiên như gà rán, khoai tây chiên,...', 1, '2025-07-01 20:35:00'),
	(11, 1, null, 'Hải sản', 'Các món chế biến từ hải sản như tôm, cua, mực,...', 1, '2025-07-01 20:40:00'),
	(12, 1, null, 'Cơm', 'Các món cơm dĩa, cơm phần, cơm chiên,...', 1, '2025-07-01 20:45:00'),
	(13, 1, null, 'Đồ ăn nhanh', 'Hamburger, sandwich, xúc xích, gà rán,...', 1, '2025-07-01 20:50:00'),
	(14, 1, null, 'Đồ hấp', 'Món hấp như bánh bao, há cảo, cá hấp,...', 1, '2025-07-01 20:55:00'),
	(15, 1, null, 'Canh & Súp', 'Các loại canh, súp ăn kèm cơm hoặc khai vị.', 1, '2025-07-01 21:00:00');
    
INSERT INTO vinaeatery.foods(id, restaurant_id, image, name, category_food_id, price, unit, description, status, update_at)
VALUES (1, 1, null, 'Ba rọi nướng sả', 9, 120000, 'Phần', 'Thịt ba rọi nướng thơm lừng với sả và gia vị đặc trưng.', 1, '2025-07-02 10:00:00'),
	(2, 1, null, 'Bò xào cải thìa', 2, 135000, 'Phần', 'Thịt bò thăn mềm mại xào cùng cải thìa tươi xanh.', 1, '2025-07-02 10:05:00'),
	(3, 1, null, 'Gỏi tôm thịt', 1, 95000, 'Phần', 'Món gỏi thanh mát với tôm sú, thịt heo và rau củ.', 1, '2025-07-02 10:10:00'),
	(4, 1, null, 'Mì xào bò phô mai', 7, 100000, 'Phần', 'Mì trứng xào bò với phô mai béo ngậy.', 1, '2025-07-02 10:15:00'),
	(5, 1, null, 'Đậu hũ kho nấm', 5, 75000, 'Phần', 'Đậu hũ trắng kho cùng nấm kim châm và gia vị đậm đà.', 1, '2025-07-02 10:20:00'),
	(6, 1, null, 'Lẩu dê lá chanh', 8, 250000, 'Nồi', 'Lẩu thịt dê nấu với lá chanh, sả, rau nhúng đa dạng.', 1, '2025-07-02 10:25:00'),
	(7, 1, null, 'Súp gà nấm', 15, 70000, 'Tô', 'Súp ức gà nấu cùng nấm, cà rốt và hành ngò.', 1, '2025-07-02 10:30:00'),
	(8, 1, null, 'Gà chiên bơ', 10, 95000, 'Phần', 'Ức gà phi lê chiên vàng với bơ thơm ngậy.', 1, '2025-07-02 11:00:00'),
	(9, 1, null, 'Mực xào cay', 11, 110000, 'Phần', 'Mực ống xào với sả, ớt và gia vị đậm đà.', 1, '2025-07-02 11:05:00'),
	(10, 1, null, 'Canh rong biển trứng', 15, 65000, 'Tô', 'Canh thanh mát với rong biển và trứng gà ta.', 1, '2025-07-02 11:10:00'),
	(11, 1, null, 'Bún thịt nướng', 7, 120000, 'Tô', 'Thịt ba rọi nướng ăn kèm bún tươi, rau sống.', 1, '2025-07-02 11:15:00'),
	(12, 1, null, 'Khoai tây chiên', 10, 45000, 'Phần', 'Khoai tây chiên giòn, ăn kèm tương ớt.', 1, '2025-07-02 11:20:00'),
	(13, 1, null, 'Mì xào chay rau củ', 5, 85000, 'Phần', 'Mì trứng xào cùng nấm, cà rốt và cải thìa.', 1, '2025-07-02 11:25:00'),
	(14, 1, null, 'Gỏi cuốn đậu hũ', 5, 70000, 'Phần', 'Đậu hũ chiên cuốn rau và bún, chấm nước mắm chay.', 1, '2025-07-02 11:30:00'),
	(15, 1, null, 'Bánh mì ốp la', 13, 40000, 'Ổ', 'Bánh mì giòn ăn kèm trứng gà ốp la và pate.', 1, '2025-07-02 11:35:00'),
	(16, 1, null, 'Lẩu hải sản chua cay', 8, 280000, 'Nồi', 'Tôm, mực, cá cùng rau lẩu và nước lẩu chua cay.', 1, '2025-07-02 11:40:00'),
	(17, 1, null, 'Phở bò tái', 7, 75000, 'Tô', 'Phở nước truyền thống với thịt bò tái.', 1, '2025-07-02 11:45:00');

INSERT INTO vinaeatery.recipes(food_id, ingredient_id, quantity, note)
VALUES (1, 1, 1, '1kg thịt ba rọi'), (1, 28, 1, '1 cây sả'), (1, 17, 1, '500ml nước mắm'), (1, 19, 1, '1000ml dầu ăn'), (1, 29, 1, '100g gừng'),
	(2, 2, 1, '1kg thịt bò thăn'), (2, 11, 1, '1kg cải thìa'), (2, 18, 1, '450ml dầu hào'), (2, 17, 1, '500ml nước mắm'), (2, 19, 1, '1000ml dầu ăn'),
	(3, 6, 1, '1kg tôm sú'), (3, 1, 1, '1kg thịt ba rọi'), (3, 13, 1, '1kg cà rốt'), (3, 17, 1, '500ml nước mắm'), (3, 16, 1, '1000g đường'),
	(4, 2, 1, '1kg bò thăn'), (4, 24, 1, '300g mì trứng'), (4, 30, 2, '2 miếng phô mai'), (4, 19, 1, '1 lít dầu ăn'),
	(5, 21, 2, '2 miếng đậu hũ'), (5, 22, 1, '150g nấm kim châm'), (5, 17, 1, '500ml nước mắm'), (5, 15, 1, '500g muối hột'), (5, 29, 1, '100g gừng'),
	(6, 3, 1, '1kg thịt dê'), (6, 27, 1, '50g lá chanh'), (6, 28, 2, '2 cây sả'), (6, 29, 1, '100g gừng'), (6, 12, 1, '1kg rau muống'),
	(7, 4, 1, '1kg ức gà'), (7, 22, 1, '150g nấm kim châm'), (7, 13, 1, '1kg cà rốt'), (7, 15, 1, '500g muối'), (7, 19, 1, '1 lít dầu ăn'),
	(8, 4, 1, '1kg ức gà phi lê'), (8, 20, 1, '200g bơ thực vật'), (8, 15, 1, '500g muối hột để ướp nhẹ'), (8, 19, 1, '1 lít dầu ăn để chiên'),
	(9, 7, 1, '1kg mực ống'), (9, 28, 1, '1 cây sả băm nhỏ'), (9, 29, 1, '100g gừng lát'), (9, 17, 1, '500ml nước mắm'), (9, 19, 1, '1 lít dầu ăn'),
	(10, 26, 1, '100g rong biển khô'), (10, 9, 2, '2 quả trứng gà ta'), (10, 15, 1, '500g muối hột'), (10, 13, 1, '1kg cà rốt'),
	(11, 1, 1, '1kg thịt ba rọi nướng'), (11, 23, 1, '500g bún tươi'), (11, 13, 1, '1kg cà rốt ngâm chua'), (11, 17, 1, '500ml nước mắm pha'), (11, 27, 1, '50g lá chanh trang trí'),
	(12, 14, 1, '1kg khoai tây'), (12, 19, 1, '1 lít dầu ăn'), (12, 15, 1, '500g muối hột'),
	(13, 24, 1, '300g mì trứng'), (13, 11, 1, '1kg cải thìa'), (13, 13, 1, '1kg cà rốt'), (13, 22, 1, '150g nấm kim châm'), (13, 19, 1, '1 lít dầu ăn'),
	(14, 21, 2, '2 miếng đậu hũ chiên'), (14, 23, 1, '500g bún tươi'), (14, 13, 1, '1kg cà rốt bào sợi'), (14, 17, 1, '500ml nước mắm chay pha loãng'),
	(15, 9, 2, '2 quả trứng gà ốp la'), (15, 20, 1, '200g bơ thực vật'),
	(16, 6, 1, '1kg tôm sú'), (16, 7, 1, '1kg mực ống'), (16, 8, 1, '1kg cá basa phi lê'), (16, 28, 2, '2 cây sả đập dập'), (16, 29, 1, '100g gừng'), (16, 12, 1, '1kg rau muống'),
	(17, 2, 1, '1kg thịt bò thăn'), (17, 25, 1, '200g miến dong khô dùng thay bánh phở'), (17, 15, 1, '500g muối hột'), (17, 17, 1, '500ml nước mắm'), (17, 29, 1, '100g gừng nướng để làm nước dùng');
    
INSERT INTO vinaeatery.orders(id, restaurant_id, create_at, employee_id, customer_id, total_price, status, pay_id, pay_method_id, pay_time, pay_total_price, pay_status)
VALUES	(1, 1, '2025-07-21 10:00:00', 1, 1, 260000, 1, "thanh-toan-bang-tien-mat-1", "1", "2025-07-21 10:00:00", 260000, 1);

INSERT INTO vinaeatery.order_details(order_id, food_id, price, quantity)
VALUES	(1, 1, 120000, 1), (1, 3, 95000, 1), (1, 12, 45000, 1);

INSERT INTO vinaeatery.use_tables (id, restaurant_id, time_start, time_end, table_id, employee_id, customer_id, order_id, order_table_id, status)
VALUES (1, 1, '2025-07-24 00:00:00', null, 1, null, null, null, null, 1),
    (2, 1, '2025-07-24 00:00:00', null, 2, null, null, null, null, 1),
    (3, 1, '2025-07-24 00:00:00', null, 3, null, null, null, null, 1),
    (4, 1, '2025-07-24 00:00:00', null, 4, null, null, null, null, 1),
    (5, 1, '2025-07-24 00:00:00', null, 5, null, null, null, null, 1),
    (6, 1, '2025-07-24 00:00:00', null, 6, null, null, null, null, 1),
    (7, 1, '2025-07-24 00:00:00', null, 7, null, null, null, null, 1),
    (8, 1, '2025-07-24 00:00:00', null, 8, null, null, null, null, 1),
    (9, 1, '2025-07-24 00:00:00', null, 9, null, null, null, null, 1),
    (10, 1, '2025-07-24 00:00:00', null, 10, null, null, null, null, 1),
    (11, 1, '2025-07-24 00:00:00', null, 11, null, null, null, null, 1),
    (12, 1, '2025-07-24 00:00:00', null, 12, null, null, null, null, 1),
    (13, 1, '2025-07-24 00:00:00', null, 13, null, null, null, null, 1),
    (14, 1, '2025-07-24 00:00:00', null, 14, null, null, null, null, 1),
    (15, 1, '2025-07-24 00:00:00', null, 15, null, null, null, null, 1),
    (16, 1, '2025-07-24 00:00:00', null, 16, null, null, null, null, 1),
    (17, 1, '2025-07-24 00:00:00', null, 17, null, null, null, null, 1),
    (18, 1, '2025-07-24 00:00:00', null, 18, null, null, null, null, 1),
    (19, 1, '2025-07-24 00:00:00', null, 19, null, null, null, null, 1),
    (20, 1, '2025-07-24 00:00:00', null, 20, null, null, null, null, 1),
    (21, 1, '2025-07-24 00:00:00', null, 21, null, null, null, null, 1),
    (22, 1, '2025-07-24 00:00:00', null, 22, null, null, null, null, 1),
    (23, 1, '2025-07-24 00:00:00', null, 23, null, null, null, null, 1),
    (24, 1, '2025-07-24 00:00:00', null, 24, null, null, null, null, 1),
    (25, 1, '2025-07-24 00:00:00', null, 25, null, null, null, null, 1),
    (26, 1, '2025-07-24 00:00:00', null, 26, null, null, null, null, 1),
    (27, 1, '2025-07-24 00:00:00', null, 27, null, null, null, null, 1),
    (28, 1, '2025-07-24 00:00:00', null, 28, null, null, null, null, 1),
    (29, 1, '2025-07-24 00:00:00', null, 29, null, null, null, null, 1),
    (30, 1, '2025-07-24 00:00:00', null, 30, null, null, null, null, 1);
    
INSERT INTO vinaeatery.use_foods (id, restaurant_id, time_start, time_end, food_id, employee_id, status)
VALUES (1, 1, '2025-07-24 00:00:00', NULL, 1, NULL, 1),
	(2, 1, '2025-07-24 00:00:00', NULL, 2, NULL, 1),
	(3, 1, '2025-07-24 00:00:00', NULL, 3, NULL, 1),
	(4, 1, '2025-07-24 00:00:00', NULL, 4, NULL, 1),
	(5, 1, '2025-07-24 00:00:00', NULL, 5, NULL, 1),
	(6, 1, '2025-07-24 00:00:00', NULL, 6, NULL, 1),
	(7, 1, '2025-07-24 00:00:00', NULL, 7, NULL, 1),
	(8, 1, '2025-07-24 00:00:00', NULL, 8, NULL, 1),
	(9, 1, '2025-07-24 00:00:00', NULL, 9, NULL, 1),
	(10, 1, '2025-07-24 00:00:00', NULL, 10, NULL, 1),
	(11, 1, '2025-07-24 00:00:00', NULL, 11, NULL, 1),
	(12, 1, '2025-07-24 00:00:00', NULL, 12, NULL, 1),
	(13, 1, '2025-07-24 00:00:00', NULL, 13, NULL, 1),
	(14, 1, '2025-07-24 00:00:00', NULL, 14, NULL, 1),
	(15, 1, '2025-07-24 00:00:00', NULL, 15, NULL, 1),
	(16, 1, '2025-07-24 00:00:00', NULL, 16, NULL, 1),
	(17, 1, '2025-07-24 00:00:00', NULL, 17, NULL, 1);