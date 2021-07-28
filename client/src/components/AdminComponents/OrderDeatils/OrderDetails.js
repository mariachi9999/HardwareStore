import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getOrderDetails } from '../../../Redux/actions';
import Loader from '../../Loader/Loader';
import Table from '../TableComponent/TableComponent';
import Select from '../../Select/Select';
import COLUMNS from './columns';
import axios from 'axios';

import styles from './OrderDetails.module.css';

const OrderDetails = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const [orderStatus, setOrderStatus] = React.useState('');
	const { orderDetails } = useSelector(state => state.admin);

	const email = useSelector(state => state.user.userData.email);

	React.useEffect(() => {
		dispatch(getOrderDetails(id));
	}, [dispatch, id]);

	const mapData = array => {
		const data =
			array &&
			array.map(o => {
				return {
					id: o?.id || '--',
					price: o?.price || '--',
					quantity: o?.quantity || '--',
					productName: o?.product?.name || '--',
					image: o?.product?.image || '--',
					brand: o?.product?.brand?.name || '--'
				};
			});
		return data;
	};

	React.useEffect(() => {
		axios.put(`https://ecommerceherni.herokuapp.com/orders/order/${id}`, {
			status: orderStatus,
			email: email
		});
	}, [orderStatus]);

	const changeStatus = event => {
		event.preventDefault();
		setOrderStatus(event.target.value);
		window.location.reload();
	};

	return (
		<div className={styles.orderDetailsContainer}>
			<div className={styles.orderDetailsData}>
				<div className={styles.orderDetailsTitle}>
					<h2>HardwareStore</h2>
				</div>
				{orderDetails ? (
					[orderDetails].map(o => (
						<div key={o?.orderId} className={styles.orderDetailsHeader}>
							<div className={styles.orderDetailsNumber}>
								<div className={styles.orderDetails}>
									<p className={styles.orderAndAmount}>
										<span className={styles.orderDetailsReference}>
											Order N°: {o?.orderId || '--'}
										</span>
										<span className={styles.orderDetailsReference}>
											Amount: $ {o?.ammount || '--'}
										</span>
									</p>
									<p className={styles.orderDetailsDate}>
										<span className={styles.orderDetailsReference}>
											Created At: {o?.createdAt || '--'}
										</span>
										<span className={styles.orderDetailsReference}>
											Status: {o?.status || '--'}
										</span>
									</p>
								</div>
							</div>
							<div>
								<div className={styles.customerDetails}>
									<div>
										<span className={styles.orderDetailsReference}>
											Customer:
										</span>
										<span>
											{`${' '}`}
											{`${o?.user?.name || '--'} ${o?.user?.surname || '--'}`}
										</span>
									</div>
									<div>
										<span className={styles.orderDetailsReference}>
											Phone:{' '}
										</span>
										<span>{o?.user.phone || '--'}</span>
									</div>
									<div>
										<span className={styles.orderDetailsReference}>
											E-mail:{' '}
										</span>
										<span>{o?.user.email || '--'}</span>
									</div>
								</div>
								<div className={styles.addressDetail}>
									<div>
										<span className={styles.orderDetailsReference}>
											Address:
										</span>
										<span>{`${o?.user?.address || '--'} N°: ${o?.user
											?.addressNumber || '--'}`}</span>
									</div>
									<div>
										<span className={styles.orderDetailsReference}>
											Postal Code:{' '}
										</span>
										<span>{o?.user?.postalCode}</span>
									</div>
								</div>
							</div>
						</div>
					))
				) : (
					<Loader />
				)}
				<div className={styles.orderTableDetails}>
					{orderDetails ? (
						<Table
							dataToPrint={mapData(orderDetails?.orderDetails)}
							formatColumn={COLUMNS}
						/>
					) : (
						<Loader />
					)}
				</div>
				<div className={styles.changeStatusOrder}>
					<span className={styles.selectTitle}>Change Status:</span>
					{orderDetails && (
						<Select
							initialValue={orderDetails?.status}
							values={['created', 'cancelled', 'completed', 'dispatched']}
							onChange={changeStatus}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default OrderDetails;
