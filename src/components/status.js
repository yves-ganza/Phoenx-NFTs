import React from 'react'
import Alert from 'react-bootstrap/Alert'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Status(props) {
    const getStatus = () => {

        if(props.error) return 'danger'

        let variant = ''
        switch (props.text.split(' ')[0]) {
            case 'Minting':
                variant =  'info';
                break;
            case 'Minted':
                variant = 'success';
                break;
            case 'Authorizing':
                variant = 'warning';
                break;
            case 'Connected':
                variant = 'success';
                break;
            default:
                variant = '';
        }

        return variant
    }
    return(
        <Alert
            variant={getStatus()}
        >
            {props.text}
        </Alert>
    )
}