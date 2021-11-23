import React from 'react'
import Alert from 'react-bootstrap/Alert'

export default function Status(props) {
    const getStatus = () => {

        if(props.error) return 'danger'

        let variant = ''
        switch (props.text.split(' ')[0]) {
            case 'Mining':
                variant =  'info';
                break;
            case 'Mined':
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