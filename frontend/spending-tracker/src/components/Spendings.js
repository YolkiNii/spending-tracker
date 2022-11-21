import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

const SPENDING_URL = '/spendings';

const Spendings = () => {
    const {auth} = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [spendingInfos, setSpendingInfos] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const controller = new AbortController();

        const getSpendingInfos = async () => {
            try {
                const response = await axiosPrivate.get(SPENDING_URL + `/${auth.username}`, {
                    signal: controller.signal
                });
                console.log(response.data);
                setSpendingInfos(response.data);
            }
            catch (err) {
                console.log(err);
            }
            finally {
                setIsLoading(false);
            }
        }

        getSpendingInfos();

        return () => {
            controller.abort();
        }
    }, []);

    return (
        <>
            {isLoading ? (
                <p>Is Loading</p>
            ) : (
                <>
                    <h2>Your Spending</h2>
                    {spendingInfos?.length ? (
                        <ul>
                            {spendingInfos.map((spendingInfo, i) => <p key={i}>{`Name: ${spendingInfo.name} Amount: ${spendingInfo.amount}`}</p>)}
                        </ul>
                    ) : <p>No Spending Record</p>
                }
                </>
            )}
        </>
    );
}

export default Spendings