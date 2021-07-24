const columns = [
	{
		Header: 'User Information',
		columns: [
			{
				Header: 'Id',
				accessor: 'userId',
			},
			{
				Header: 'Name',
				accessor: 'userName',
			},
			{
				Header: 'Last name',
				accessor: 'surname',
			},
			{
				Header: 'Email',
				accessor: 'email',
			},
		],
	},
	{
		Header: 'Order Detail',
		columns: [
			{
				Header: 'Id',
				accessor: 'orderId',
			},
			{
				Header: 'Created at',
				accessor: 'date',
			},
			{
				Header: 'Update at',
				accessor: 'updatedAt',
			},
			{
				Header: 'Ammount',
				accessor: 'ammount',
			},
			{
				Header: 'Status',
				accessor: 'status',
				Cell: (row) => {
					const status = row.row.original.status;
					return (
						<span
							style={{
								fontStyle: 'bold',
								color: `${
									status === 'created'
										? '#FFA900'
										: status === 'processing'
										? '#141E61'
										: status === 'cancelled'
										? '#8D2828'
										: '#5D8233'
								}`,
							}}
						>
							{status}
						</span>
					);
				},
			},
		],
	},
];

export default columns;