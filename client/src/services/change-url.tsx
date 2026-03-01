// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState } from "../store";
// import { setEmployee } from "../store/employee-slice";

// // Hàm xử lý việc thay đổi url trang
// export const handleChangeUrl = () => {
//     // Dispatch redux
//     const dispatch = useDispatch();

//     // // Khi app load, kiểm tra xem có dữ liệu tạm không
//     // useEffect(() => {
//     //     const employeeLoginSaved = sessionStorage.getItem('employee-login-temp');
//     //     if (employeeLoginSaved) {
//     //         dispatch(setEmployee(JSON.parse(employeeLoginSaved)));
//     //         sessionStorage.removeItem('employee-login-temp');
//     //     }
//     // }, []);

//     // // Khi người dùng reload/thoát tab → lưu state Redux
//     // useEffect(() => {
//     //     const saveOnUnload = () => {
//     //         const employee = JSON.parse(sessionStorage.getItem('employee-login-temp')!); // tránh lưu đè nếu đã lưu
//     //         if (!employee) {
//     //             const employeeLogin = useSelector((state: RootState) => state!.employee!.currentEmployee);
//     //             sessionStorage.setItem('employee-login-temp', JSON.stringify(employeeLogin));
//     //         }
//     //     };

//     //     window.addEventListener('beforeunload', saveOnUnload);
//     //     return () => window.removeEventListener('beforeunload', saveOnUnload);
//     // }, []);

//     const handleEmployeeLogin = () => {
//         const employeeLoginSaved = sessionStorage.getItem('employee-login-temp');
//         if (employeeLoginSaved) {
//             dispatch(setEmployee(JSON.parse(employeeLoginSaved)));
//             sessionStorage.removeItem('employee-login-temp');
//         } else {
//             const saveOnUnload = () => {
//                 const employeeLogin = useSelector((state: RootState) => state!.employee!.currentEmployee);
//                 sessionStorage.setItem('employee-login-temp', JSON.stringify(employeeLogin));
//             };

//             window.addEventListener('beforeunload', saveOnUnload);
//         }
//     }


//     // F5 hoặc reload trang
//     const isManualReload =
//         performance.navigation.type === 1 || // Loại 1: reload
//         (performance.getEntriesByType("navigation")[0] as any)?.type === "reload";

//     // Nhập thủ công
//     const isTyped =
//         document.referrer === "" && window.performance.navigation.type !== 1;

//     // Kiểm tra
//     if (isManualReload) {
//         console.log("🌀 Người dùng F5 hoặc reload trang");
//         handleEmployeeLogin();
//     } else if (isTyped) {
//         console.log("⌨️ Người dùng gõ tay URL vào");
//         handleEmployeeLogin();
//     } else {
//         console.log("✅ Chuyển trang nội bộ (SPA)");
//     }
// }