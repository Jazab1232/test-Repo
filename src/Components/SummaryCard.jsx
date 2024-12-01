import React from 'react'
import '../styles/summaryCard.css'


export default function SummaryCard({ Icon, quantity, title, backgroundColor }) {
    return (
        <div className='summaryCard'>
            <div className='summaryCardIcon'  style={{ backgroundColor: backgroundColor }}>
                {Icon && <Icon fill='#fff' width='20px' heigth='20px' />}
            </div>
            <div className="summaryCardBox">
                <p className='summaryCardTitle'>{title}</p>
                <p className='summaryCardQuantity'>{quantity}</p>
            </div>

        </div>
    )
}
