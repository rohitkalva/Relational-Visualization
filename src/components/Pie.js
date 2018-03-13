import React from 'react'
import {Link } from 'react-router-dom'

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
