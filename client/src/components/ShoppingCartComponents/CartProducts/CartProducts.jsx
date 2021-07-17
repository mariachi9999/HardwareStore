import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { addToCart, removeFromCart, adjustQty } from '../../../Redux/actions';
import style from './CartProducts.module.css';
import { BsTrash } from 'react-icons/bs';
import { formatNumber } from '../../../helper/priceFormater';

function CartList({ info, image, name, price, qty }) {
	const dispatch = useDispatch();
	const [prodInfo, setProdInfo] = useState(info);

	function handlePlus() {
		setProdInfo(info);
		dispatch(addToCart(prodInfo));
	}

	function handleMinus() {
		let newQuantity = qty;
		if (qty === 1) {
			newQuantity = qty;
		} else {
			newQuantity = qty - 1;
		}
		dispatch(adjustQty(info.id, newQuantity));
	}

	function handleDeleteProd() {
		dispatch(removeFromCart(info.id));
	}

	let subtot = price * qty;
	let subtotFormat = formatNumber.new(subtot, '$');

	return (
		<div>
			<div className={style.shoppingCartContainer}>
				<div className={style.cartProductsContainer}>
					<div className={style.imgcontainerDiv}>
						<div className={style.cartImageDiv}>
							<img src={image} className={style.cartImage} alt='productFoto' />
						</div>
					</div>
					<div className={style.prodName}>
						<p>{name}</p>
					</div>
					<div className={style.subtot}>
						<h3>{subtotFormat}</h3>
					</div>
					<div className={style.cantAndPrice}>
						<div className={style.modifyQtyButtons}>
							<button onClick={handleMinus} className={style.plusMinusButtons}>
								-
							</button>
							<h3>{qty}</h3>
							<button onClick={handlePlus} className={style.plusMinusButtons}>
								+
							</button>
						</div>
						<button
							onClick={handleDeleteProd}
							className={style.trashButtonCart}
						>
							<BsTrash />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CartList;