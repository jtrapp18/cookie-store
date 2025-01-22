import {Fragment, useState, useEffect, useContext} from 'react';
import styled from 'styled-components';
import {UserContext} from '../context/userProvider'
import {useOutletContext} from "react-router-dom";
import CartItem from '../components/CartItem';
import Button from 'react-bootstrap/Button';

const StyledMain = styled.main`
  padding: 20px;
  90vh;
  display: flex;

  h3 {
    font-size: clamp(1rem, 1.8vw, 1.1rem)
  }
`
const StyledOrderSummary = styled.article`
    padding: 20px;
    margin: 10px;
    height: 100%;
    width: 50%;
    margin-bottom: 10px;
    position: relative;
    box-shadow: var(--shadow);

    div {
      display: flex;
      width: 50%;
      justify-content: space-between;
    }

    h3 {
      font-size: clamp(1rem, 1.8vw, 1.1rem)
    }

    p {
      line-height: 1;
    }
`

const StyledDiv = styled.div`
  padding: 20px;
  margin: 10px;
  display: grid;
  width: 50%;
  box-shadow: var(--shadow);

  article {
    zoom: .7;
  }
`

const Checkout = () => {
  const { user, setUser } = useContext(UserContext);
  const { orders, cartOrder } = useOutletContext();
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState(user.address);
  const [isEditing, setIsEditing] = useState(false);

  // Update average review when reviews change
  useEffect(() => {
    if (cartOrder && cartOrder.cartItems.length > 0) {
      const totalPrice = cartOrder.cartItems.reduce((sum, item) => sum + (item.cookie.price * item.numCookies), 0);
      setTotalPrice(totalPrice.toFixed(2));
    }
  }, [cartOrder]);

  return (
      <StyledMain>
        <StyledDiv>
          <div>
            <h3>Delivering to {`${user.first_name} ${user.last_name}`}</h3>  
            {!isEditing ? (
              <>
                <p>{deliveryAddress}</p>
                <Button onClick={()=>setIsEditing(true)}>Change Delivery Address</Button>
              </>
            ) : (
              <>
                <input 
                  type="text" 
                  name="address" 
                  value={deliveryAddress} 
                  onChange={(e)=>setDeliveryAddress(e.target.value)} 
                />
                <Button onClick={()=>setIsEditing(false)}>Confirm Changes</Button>
              </>
            )}
          </div>
          <hr />
          <h3>Selected Cookies</h3>         
          {cartOrder.cartItems.map(cartItem=>
            <Fragment key={cartItem.id}>
            <CartItem
                {...cartItem}
                isFinal={true}
            />
            <hr />
          </Fragment>
          )}
        </StyledDiv>
        <StyledOrderSummary>
          <div>
            <p>Order ID:</p>
            <p>{cartOrder.id}</p>
          </div>
          <div>
            <p>Items ({2})</p>
            <p>${totalPrice}</p>
          </div>
          <div>
            <p>Shipping:</p>
            <p>$0.00</p>
          </div>
          <div>
            <p>Taxes:</p>
            <p>$0.00</p>
          </div>
          <div>
            <h3>Order Total</h3>
            <h3>${totalPrice}</h3>
          </div>
          <hr />
          <Button variant="warning">Place Order</Button>
        </StyledOrderSummary>
      </StyledMain>
    );
  };
  
  export default Checkout;
  