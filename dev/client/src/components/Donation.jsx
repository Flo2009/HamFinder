import { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { CREATE_PAYMENT_INTENT, UPDATE_USER_DONATION } from '../utils/mutations';
import '../App.css'; // Optional: Use if you're using external CSS for styling.
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useElements, useStripe, CardElement, PaymentElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom'; // To get dark mode context

// Stripe Public Key
const stripePromise = loadStripe('pk_test_51Q2hSHHz1ELVl9MVTQ651hh3KN64RyV6yakXXS3GMIp9l4Eu4kKV4fVClp0pT0g8k4b8LhouoL1U9A1RJrNE0kbQ00Ir1kEh99');

const DonationForm = ({ clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [customAmount, setCustomAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [updateUserDonation] = useMutation(UPDATE_USER_DONATION);

    const fixedAmounts = [5, 10, 20, 50, 100]; // Fixed donation amounts

    const handleSelectAmount = (amount) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (e) => {
        setCustomAmount(e.target.value);
        setSelectedAmount(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let donationAmount = customAmount ? customAmount : selectedAmount;
        donationAmount = parseInt(donationAmount);
        console.log(donationAmount);
        if (!stripe || !elements || donationAmount <= 0) {
        return;
        }
       
        setLoading(true);
        
        try {
        // // Call the GraphQL mutation to create a Payment Intent
        // const { data: paymentData } = await createPaymentIntent({
        //     variables: { amount: donationAmount },
        // });

        // const clientSecret = paymentData.createPaymentIntent.clientSecret;
        
        // Confirm the payment using Stripe
        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + '/',
            }, 
            redirect: 'if_required',
           
        });
        console.log(result);
        if (result.error) {
            alert(result.error.message);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
            // After successful payment, update the user donation information
            await updateUserDonation({ variables: { amount: donationAmount } });
            alert('Donation successful! Thank you.');
            navigate('/');
            window.location.reload();
            }
        }
        } catch (error) {
        console.error(error);
        alert('Error processing the donation.');
        } finally {
        setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
            {fixedAmounts.map((amount) => (
            <Col key={amount} className="text-center mb-2">
                <Button
                variant={selectedAmount === amount ? 'primary' : 'outline-primary'}
                onClick={() => handleSelectAmount(amount)}
                >
                ${amount}
                </Button>
            </Col>
            ))}
        </Row>

        <Form.Group className="mb-3">
            <Form.Label >Or enter a custom amount:</Form.Label>
            <Form.Control
            type="number"
            placeholder="Enter custom amount"
            value={customAmount}
            onChange={handleCustomAmountChange}
            min="1"
            />
        </Form.Group>

        <PaymentElement className="mb-3" />

        <div className="text-center">
            <Button variant="success" type="submit" disabled={!stripe || loading}>
            {loading ? 'Processing...' : 'Donate'}
            </Button>
        </div>
        </Form>
    );
  };
  
const Donation = () => {
    const [clientSecret, setClientSecret] = useState('');
    
    const [createPaymentIntent] = useMutation(CREATE_PAYMENT_INTENT);
    const { isDarkMode } = useOutletContext(); // Use context to determine if dark mode is on

     // Fetch the clientSecret when the component mounts
     useEffect(() => {
        const fetchClientSecret = async () => {
            try {
                const { data } = await createPaymentIntent({ variables: { amount: 1 } }); // Initialize with a minimal amount
                setClientSecret(data.createPaymentIntent.clientSecret);
            } catch (error) {
                console.error('Error fetching clientSecret:', error);
            }
        };
        fetchClientSecret();
    }, [createPaymentIntent]);

const options = {
    clientSecret: clientSecret,
};

return (
    <Container className={`donation-container ${isDarkMode ? 'dark-mode' : ''} mt-5`}>
        <h1 className="text-center mb-4">Donate</h1>
        {clientSecret && (
            <Elements stripe={stripePromise} options={options} >
                <DonationForm clientSecret={clientSecret}/>
            </Elements>
         )}
    </Container>
    );

};
export default Donation;