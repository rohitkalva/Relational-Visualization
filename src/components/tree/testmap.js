import React, { Component } from 'react';
import { TreeTable } from './treetable/TreeTable';
import {Column} from "./Components/column/Column";
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import ReactDataGrid from 'react-data-grid';
import {Tooltip} from "./Components/tooltip/Tooltip";
export default class Treetable extends Component {

    constructor(props) {
        super(props);
        this.state = { selectedFile: null , selectedFiles1: [] };
    }    

    onMultiMetaKeySelectionChange(e) {
        this.setState({ selectedFiles: e.selection });
    }
    onSelectionChange(e) {
        this.setState({ selectedFiles1: e.selection });
    }
    
             
    render() {
        var Taxonomy = this.props.treetaxData;

        var keyword=this.props.treekeyData;
        
            return (
            <div>
                <div className="content-section introduction">
                    <div className="feature-intro">
                        <h1>TreeTable</h1>
                       
                    </div>
                </div>

                <div className="content-section implementation">

                    <div style={{ 'marginTop': 'auto' }}>Selected Node: {this.state.selectedFile && this.state.selectedFile.data.name}</div>
                   
                    <TreeTable value={Taxonomy} selectionMode="multiple" header="Taxonomy Data" selectionChange={this.onMultiMetaKeySelectionChange.bind(this)}>
                      
                        <Column field="id" header="id"></Column>
                       
                        <Column field="parentName" header="parentName"></Column>
                        <Column field="parentRank" header="parentRank"></Column>
                        
                        <Column field="childName" header="childName"></Column>
                        <Column field="childRank" header="childRank"></Column>
                        <Column field="noOfSpectra" header="noOfSpectra"></Column>
                    </TreeTable> 



                     <TreeTable value={keyword} selectionMode="Basic" header="Keyword Data" selectionChange={this.onSelectionChange.bind(this)}>
                      
                      <Column field="id" header="id"></Column>
                 
                      <Column field="parentName" header="parentName"></Column>
                      <Column field="parentHierarchy" header="parentHierarchy"></Column>
                      
                      <Column field="childName" header="childName"></Column>
                      <Column field="childHierarchy" header="childHierarchy"></Column>
                      <Column field="noOfSpectra" header="noOfSpectra"></Column>
                  </TreeTable> 
                   
                    
                </div>

            </div>
        )
    }
}


