import { useState, useEffect } from "react"
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate"

const SPENDING_URL = '/spendings';

const SpendingInfoEditor = ({spendingInfo, closeEditor, doUpdate}) => {
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState('2000-01-01');
    const {auth} = useAuth();
    const [isAddingNew, setIsAddingNew] = useState(false);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        if (spendingInfo) {
            setIsAddingNew(false);
            setName(spendingInfo.name);
            setNote(spendingInfo.note);
            setAmount(spendingInfo.amount);
            const dateParts = spendingInfo.spending_date.split('-');
            const formattedDate = dateParts[0] + '-' + dateParts[1] + '-' + dateParts[2].substr(0,2);
            setDate(formattedDate);
        }
        else {
            setIsAddingNew(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newSpendingInfo = {
            name,
            note,
            amount,
            spendingDate: date
        }

        if (isAddingNew) {
            // add to database
            try {
                await axiosPrivate.post(SPENDING_URL + `/${auth.username}`,
                    JSON.stringify(newSpendingInfo));
            }
            catch (err) {
                console.err(err);
                return;
            }
        }
        else {
            // send update to database
            try {
                await axiosPrivate.put(SPENDING_URL + `/${spendingInfo.spending_id}`,
                    JSON.stringify(newSpendingInfo));
            }
            catch (err) {
                console.err(err);
                return;
            }
        }

        doUpdate();
        closeEditor();
        setName('');
        setNote('');
        setAmount(0);
        setDate('2000-01-01');
    }

    const handleCancel = () => {
        closeEditor();
        setName('');
        setNote('');
        setAmount(0);
        setDate('2000-01-01');
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input
                type='text'
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <label>Note</label>
            <input
                type='text'
                value={note}
                onChange={e => setNote(e.target.value)}
            />
            <label>Amount</label>
            <input
                type='number'
                step='0.01'
                value={amount}
                onChange={e => setAmount(e.target.value)}
            />
            <label>Date</label>
            <input
                type='date'
                value={date}
                onChange={e => setDate(e.target.value)}
            />
            <button type='submit'>Save</button>
            <button type='button' onClick={handleCancel}>Cancel</button>
        </form>
    )
}

export default SpendingInfoEditor