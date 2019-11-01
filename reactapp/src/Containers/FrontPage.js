import React from 'react';
import { Line } from '../Components/Line'
import { Bar } from '../Components/Bar'

export class FrontPage extends React.Component {
    render() {
        return (
        <div style={styles.outerBox}>
            <Line />
            <Bar />
        </div>
        )
    };
}


const styles = {
    outerBox: {
        height: '100vh'
    }
}

export default FrontPage;
