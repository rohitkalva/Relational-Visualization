import React, { Component } from 'react';
import FilteredMultiSelect from 'react-filtered-multiselect';
import {Button} from "semantic-ui-react";
import axios from 'axios';

class Combobox extends Component  {
 constructor() {
    super()
    this.state = {
      options_keywords: [],
      keywords : [],
      visible_keywords : [],
      options_taxonomies : [],
      taxonomies : [],
      visible_taxonomies : [],
      propsFlag : false,
    };
    this.handleKeywordsAdd = this.handleKeywordsAdd.bind(this);
    this.handleKeywordsDelete = this.handleKeywordsDelete.bind(this);
    this.handleTaxonimiesAdd = this.handleTaxonimiesAdd.bind(this);
    this.handleTaxonimiesDelete = this.handleTaxonimiesDelete.bind(this);
 }

  componentWillReceiveProps(newProps){
   !this.state.propsFlag &&
   this.setState({
     options_keywords : newProps.keywords,
     keywords : newProps.keywords,
     options_taxonomies : newProps.taxonomies,
     taxonomies : newProps.taxonomies,
     propsFlag : true
   });
  }

  /*
  componentWillUpdate(prevprops,props) {
    if(prevprops ===! this.props){
    this.change()
    }

    //if(prevprops ===! this.props){
    //this.taxadd()
    //this.taxdel()}
  }
  */

   change(){
    this.keyadd()
    //this.keydel()
    this.taxadd()
    //this.taxdel()
    //console.log(this.state.options_taxonomies)
    //console.log(this.state.options_keywords)
  }
    
   keyadd(){ 
     if (this.state.visible_keywords.length > 0)
     {
       for (var i = 0; i < this.state.visible_keywords.length; i++)
       {
        axios.post('http://localhost:8080/visualization/interact/keyword/update', 
        { keywordId: this.state.visible_keywords[i].keywordId,  visibility: 'False' })
          .then( res => {
           const data = res.data.data;
           console.log(data)    
           if(data === 'successful'){
            this.props.setChordParams() 
           }
           })
           .catch(function (error) {
            console.log(error);
           });
        }
          
       }  
   }

   keydel(){
     
       for (var i = 0; i < this.state.options_keywords.length; i++){
        axios.post('http://localhost:8080/visualization/interact/keyword/update', 
        { keywordId: this.state.options_keywords.length[i].keywordId,  visibility: 'True' })
        .then( res => {
          const data = res.data.data;
          console.log(data)
           if(data === 'successful'){
            this.props.setChordParams()
          }
        })
        .catch(function (error) {
          console.log(error);
        });
       }     
 }

   taxadd(){     
     if (this.state.visible_taxonomies.length > 0)
     {
      for (let i = 0; i < this.state.visible_taxonomies.length; i++){
        axios.post('http://localhost:8080/visualization/interact/taxonomy/update', 
        { taxId: this.state.visible_taxonomies[i].taxId,  visibility: 'False' })
         .then( res => {
          let data = res.data.data;
          console.log(data)
          if(data === 'successful'){
            this.props.setChordParams()
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      }      
     }   
   }

   taxdel(){
    
       for(var i = 0; i < this.state.options_taxonomies.length; i++){
        axios.post('http://localhost:8080/visualization/interact/taxonomy/update', 
        { taxId: this.state.options_taxonomies[i].taxId,  visibility: 'True' })
        .then( res => {
          const data = res.data.data;
          console.log(data)
           if(data === 'successful'){
            this.props.setChordParams()
          }
        })
        .catch(function (error) {
          console.log(error);
        });
       }    
   }

  handleKeywordsAdd = (items) => {
   let keywords = [].concat(this.state.options_keywords);
    let visible_keywords = [].concat(this.state.visible_keywords);
    visible_keywords = visible_keywords.concat(items);
    visible_keywords.forEach(item => {
      keywords.splice(keywords.indexOf(item), 1);
    });
    this.setState({
      keywords        : keywords,
      visible_keywords: visible_keywords
    })
    //this.keyadd()
    };

  handleKeywordsDelete = (items) => {
    let keywords = [].concat(this.state.options_keywords);
    let visible_keywords = [].concat(this.state.visible_keywords);
    items.forEach(item => {
      visible_keywords.splice(visible_keywords.indexOf(item), 1);
    });
    visible_keywords.forEach(item => {
      keywords.splice(keywords.indexOf(item), 1);
    });
    this.setState({
      keywords        : keywords,
      visible_keywords: visible_keywords
    })
    
  };
  handleTaxonimiesAdd = (items) => {
    let taxonomies = [].concat(this.state.options_taxonomies);
    let visible_taxonomies = [].concat(this.state.visible_taxonomies);
    visible_taxonomies = visible_taxonomies.concat(items);
    visible_taxonomies.forEach(item => {
      taxonomies.splice(taxonomies.indexOf(item), 1);
    });
    this.setState({
      taxonomies        : taxonomies,
      visible_taxonomies: visible_taxonomies
    })   
  };

  handleTaxonimiesDelete = (items) => {
    let taxonomies = [].concat(this.state.options_taxonomies);
    let visible_taxonomies = [].concat(this.state.visible_taxonomies);
    items.forEach(item => {
      visible_taxonomies.splice(visible_taxonomies.indexOf(item), 1);
    });
    visible_taxonomies.forEach(item => {
      taxonomies.splice(taxonomies.indexOf(item), 1);
    });
    this.setState({
      taxonomies        : taxonomies,
      visible_taxonomies: visible_taxonomies
    })
    
  };

   reset(){
    const url = 'http://localhost:8080/visualization/interact/reset';
      axios.get(url).then( res => {
        const data = res.data.data;
        console.log(data)
        if(data === 'successful'){
          this.props.setChordParams()
        }
      })
  }

render() {
  let state = this.state;
  return (
    <div>
      <div className="row">  
        <div className="col-md-6">
         <FilteredMultiSelect
          placeholder="Select Keywords"
          buttonText="Add"
          classNames={{
            filter: 'form-control',            
            select: 'form-control',            
            button: 'btn btn btn-block btn-default',            
            buttonActive: 'btn btn btn-block btn-danger'          
          }}
          onChange={this.handleKeywordsAdd}
          options={state.keywords}
          textProp="keywordName"
          valueProp="keywordId"
        />    
        </div> 
        <div className="col-md-6">     
         <FilteredMultiSelect
           placeholder="Visible Keywords"
           buttonText="Delete"
           classNames={{
            filter: 'form-control',            
            select: 'form-control',
            button: 'btn btn btn-block btn-default',           
            buttonActive: 'btn btn btn-block btn-primary'
          }}
          onChange={this.handleKeywordsDelete}
          options={state.visible_keywords}
          textProp="keywordName"
          valueProp="keywordId"
        />
        </div>   
      </div>
      <br/>
      <div className="row">  

        <div className="col-md-6">
         <FilteredMultiSelect
           placeholder="Select Taxonomy"
           buttonText="Add"         
           classNames={{
            filter: 'form-control',            
            select: 'form-control',            
            button: 'btn btn btn-block btn-default',            
            buttonActive: 'btn btn btn-block btn-danger'
           }}
           onChange={this.handleTaxonimiesAdd}
           options={state.taxonomies}
           textProp="taxonomyName"
           valueProp="taxId"
         />
        </div> 
        <div className="col-md-6">
         <FilteredMultiSelect
           placeholder="Visible Taxonomy"
           buttonText="Delete"
           classNames={{
            filter: 'form-control',            
            select: 'form-control',
            button: 'btn btn btn-block btn-default',           
            buttonActive: 'btn btn btn-block btn-primary'
           }}
           onChange={this.handleTaxonimiesDelete}
           options={state.visible_taxonomies}
           textProp="taxonomyName"
           valueProp="taxId"
         />
        </div>  
      </div><br/>
      <Button primary  floated='left'size='small' onClick={() => this.change()}>Submit </Button>
      <Button positive floated='left' size='small'  onClick={() =>this.reset()} >Reset</Button>
      <br/>
    </div> 
);}
}

export default Combobox;