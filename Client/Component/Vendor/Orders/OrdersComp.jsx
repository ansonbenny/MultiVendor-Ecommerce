import { vendorAxios } from "@/Config/Server"
import ContentControl from "@/ContentControl/ContentControl"
import { useRouter } from "next/router"
import { useContext } from "react"

function OrdersComp({ search, setSearch, Orders, setOrders, setTotal, total }) {
  const navigate = useRouter()
  const { setVendorLogged } = useContext(ContentControl)
  return (
    <div className='OrdersComp containerVendor'>
      <div className="Head">
        <div>
          <input data-for="search" type="text" value={search} onInput={(e) => {
            setSearch(e.target.value)
          }} placeholder='Search Name' />
        </div>
      </div>

      <div className='tableDiv'>
        <div className="table-responsive text-center">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Price</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                Orders.map((obj, key) => {
                  return (
                    <tr key={key}>
                      <td>{obj.date}</td>
                      <td>{obj.customer}</td>
                      <td>{obj.price}</td>
                      <td>{obj.payType}</td>
                      <td>{obj.OrderStatus}</td>
                      <td>
                        <button data-for="actionBtn" onClick={() => {
                          navigate.push(`/vendor/orders/${obj.secretOrderId}/${obj.userId}`)
                        }}>Details</button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>

      {
        Orders.length !== total && <div>
          <button data-for="loadMore" onClick={() => {
            vendorAxios((server) => {
              server.get('/vendor/getAllOrders', {
                params: {
                  search: search,
                  skip: Orders.length,
                }
              }).then((res) => {
                if (res.data.login) {
                  setVendorLogged({ status: false })
                  localStorage.removeItem('vendorToken')
                  navigate.push('/vendor/login')
                } else {
                  setOrders([...Orders, ...res.data.orders])
                  setTotal(res.data.total)
                }
              }).catch(() => {
                console.log('err')
              })
            })
          }}>Load More</button>
        </div>
      }
    </div>
  )
}

export default OrdersComp