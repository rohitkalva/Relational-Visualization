import React from 'react'
import { Switch, Route,Link } from 'react-router-dom'
import PieK from './PieK'
import PieT from './PieT'
import PieKp from './PieKp'
import PieKPe from './PieKPe'
import PieTp from './PieTp'
import PieTPe from './PieTPe'

const Pie = () => (
    <ul>
        <h1> Please Select Option </h1>
    <li><Link to='/PieK'>Keyword Spectra Count</Link></li>
    <li><Link to='/PieKp'>Keyword Protein Count</Link></li>
    <li><Link to='/PieKPe'>Keyword Peptide Count</Link></li>
    <li><Link to='/PieT'>Taxonomy Spectra Count</Link></li>
    <li><Link to='/PieTp'>Taxonomy Protein Count</Link></li>
    <li><Link to='/PieTPe'>Taxonomy Peptide Count</Link></li>
    </ul>
)

export default Pie
