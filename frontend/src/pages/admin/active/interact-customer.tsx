import { faBell, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AdminInteractCustomer = () => {
  return (
    <>
      <main className="main">
        <div className="main__header">
          <h2 className="main__title">
            Vận hành quán ăn - Tương tác khách hàng
          </h2>
        </div>
        <div className="main__interacts">
          <div className="main__interact call">
            <h2 className="main__interact-title">
              <FontAwesomeIcon icon={faBell} /> Gọi nhân viên
            </h2>
            <div className="main__interact-list-warper">
                <div className="main__interact-list">
                  <div className="main__interact-item">
                    <b>Bàn T02-01</b>
                    <p>Gọi lúc: 2025-08-15 17:08:24</p>
                  </div>
                  <div className="main__interact-item">
                    <b>Bàn T02-01</b>
                    <p>Gọi lúc: 2025-08-15 17:08:24</p>
                  </div>
                  <div className="main__interact-item">
                    <b>Bàn T02-01</b>
                    <p>Gọi lúc: 2025-08-15 17:08:24</p>
                  </div>
                  <div className="main__interact-item">
                    <b>Bàn T02-01</b>
                    <p>Gọi lúc: 2025-08-15 17:08:24</p>
                  </div>
                  <div className="main__interact-item">
                    <b>Bàn T02-01</b>
                    <p>Gọi lúc: 2025-08-15 17:08:24</p>
                  </div>
                  <div className="main__interact-item">
                    <b>Bàn T02-01</b>
                    <p>Gọi lúc: 2025-08-15 17:08:24</p>
                  </div>
                  <div className="main__interact-item">
                    <b>Bàn T02-01</b>
                    <p>Gọi lúc: 2025-08-15 17:08:24</p>
                  </div>
                  <div className="main__interact-item">
                    <b>Bàn T02-01</b>
                    <p>Gọi lúc: 2025-08-15 17:08:24</p>
                  </div>
                  <div className="main__interact-item">
                    <b>Bàn T02-01</b>
                    <p>Gọi lúc: 2025-08-15 17:08:24</p>
                  </div>
                  <div className="main__interact-item">
                    <b>Bàn T02-01</b>
                    <p>Gọi lúc: 2025-08-15 17:08:24</p>
                  </div>
                  <div className="main__interact-item">
                    <b>Bàn T02-01</b>
                    <p>Gọi lúc: 2025-08-15 17:08:24</p>
                  </div>
                </div>
            </div>
          </div>
          <div className="main__interact chat">
            <h2 className="main__interact-title">
              <FontAwesomeIcon icon={faComment} /> Trò chuyện khách hàng
            </h2>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminInteractCustomer;
