import React from 'react'
import '../styles/summaryCard.css'

import { AllTaskIcon, } from '../Components/Icons.jsx';

export default function SummaryCard({ Icon,prevQuantity,quantity,title,backgroundColor }) {
    return (
        <div className='summaryCard'>
            <p className='summaryCardTitle'>{title}</p>
            <div className="summaryCardQuantity">
                <p>{quantity}</p>
                <div style={{backgroundColor:backgroundColor}}>
                    {Icon && <Icon fill='#fff' width='20px' heigth='20px' />}
                </div>
            </div>
            <p className='prevTask'>
                {prevQuantity} last month
            </p>
        </div>
    )
}
