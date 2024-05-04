const SpendingInfo = ({ spendingInfo, deleteInfo, openEditor }) => {
  const dateParts = spendingInfo.spending_date.split('-');
  const formattedDate =
    dateParts[0] + '-' + dateParts[1] + '-' + dateParts[2].substr(0, 2);
  return (
    <div>
      <p>{`Name: ${spendingInfo.name}   Amount: ${spendingInfo.amount}   Date: ${formattedDate}`}</p>
      {spendingInfo.note}
      <button onClick={openEditor}>Edit</button>
      <button onClick={deleteInfo}>Delete</button>
    </div>
  );
};

export default SpendingInfo;
