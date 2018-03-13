import React from 'react'
import { Link } from 'react-router-dom'

const Bar = () => (
    <ul>
        <h1> Please Select Option </h1>
    <li><Link to='/BarK'>Keyword</Link></li>
    <li><Link to='/BarT'>Taxonomy</Link></li>
    </ul>
)

export default Bar
