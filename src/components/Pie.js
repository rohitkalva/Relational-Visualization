import React from 'react'
import { Switch, Route,Link } from 'react-router-dom'
import PieK from './PieK'
import PieT from './PieT'

const Pie = () => (
    <ul>
        <h1> Please Select Option </h1>
    <li><Link to='/PieK'>Keyword</Link></li>
    <li><Link to='/PieT'>Taxonomy</Link></li>
    </ul>
)

export default Pie
