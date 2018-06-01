import React, { Component } from "react";
import { Chord } from "./Chord";
import * as d3 from "d3";
import axios from 'axios';
import { Sidebar, Segment, Dropdown, Button, Form, Menu, Icon } from 'semantic-ui-react';
import FilteredMultiSelect from 'react-filtered-multiselect';
import "../../css/style.css";
import "../../css/bootstrap.min.css";
import "../../css/appone.css";
import { setInterval } from "timers";

//for filters
class AddRemoveSelection extends Component {
 
    handleDeselect = (deselectedOptions) => {
        var selectedOptions = this.props.selectedOptions.slice()
        deselectedOptions.forEach(option => {
            selectedOptions.splice(selectedOptions.indexOf(option), 1)
        })
        this.props.onChange(selectedOptions)
    }

    handleSelect = (selectedOptions) => {
        selectedOptions.sort((a, b) => a.id - b.id)
        this.props.onChange(selectedOptions)
    }
   
    render() {
        const { options, selectedOptions, type } = this.props
        //console.log(options, selectedOptions);
        options.sort((a, b) =>  a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
        selectedOptions.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 :-1);

      

        return <div className="row mt-20">
            <div className="col-sm-6">
                <FilteredMultiSelect
                    placeholder={`Select ${type}`}
                    buttonText="Add"
                    classNames={{
                        filter: 'form-control',
                        select: 'form-control',
                        button: 'btn btn btn-block btn-default',
                        buttonActive: 'btn btn btn-block btn-primary',
                    }}
                    onChange={this.handleSelect}
                    options={options}
                    selectedOptions={selectedOptions}
                    textProp="name"
                    valueProp="id"
                />
            </div>
            <div className="col-sm-6">
                <FilteredMultiSelect
                    placeholder={`Visible ${type}`}
                    buttonText="Delete"
                    classNames={{
                        filter: 'form-control',
                        select: 'form-control',
                        button: 'btn btn btn-block btn-default',
                        buttonActive: 'btn btn btn-block btn-danger'
                    }}
                    onChange={this.handleDeselect}
                    options={selectedOptions}
                    textProp="name"
                    valueProp="id"
                />
            </div>
        </div>
    }
}

export default class ChordFinal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            master: {},
            filterKeyword: [],
            filterTaxonomy: [],
            tooltip: {},
            pFormat: d3.format(".1%"),
            qFormat: d3.format(",.0f"),
            duration: 1,
            rankList: [],
            categoryList: [],
            selectedRank: "",
            selectedCategory: "",
            keywordsOptions: [],
            selectedKeywordsOptions: [],
            taxonomyOptions: [],
            selectedTaxonomyOptions: [],
            displayItems: {},
            removedItemskey: {},
            removedItemstax: {},
            removedItems: {},
            finalData: {}
        };

        this.importJSON = this.importJSON.bind(this);
        this.addFilter = this.addFilter.bind(this);
        this.addFilterShift = this.addFilterShift.bind(this);
        this.addFilterControl = this.addFilterControl.bind(this);
        this.updateChart = this.updateChart.bind(this);
        this.updateTooltip = this.updateTooltip.bind(this);
        this.keydel = this.keydel.bind(this);
        this.taxdel = this.taxdel.bind(this);
        this.keyadd = this.keyadd.bind(this);
        this.taxadd = this.taxadd.bind(this);
        this.change = this.change.bind(this);
        this.onchangeCategory = this.onchangeCategory.bind(this);
        this.onchangeRank = this.onchangeRank.bind(this);
    }

    toggleVisibility = () => this.setState({ visible: !this.state.visible })
    
    updateTooltip = (data) => {
        this.setState({
            tooltip: data
        });
    };
    
    // filter function for mouseclick
    // Mouse interaction-1
    addFilter = (name) => {
        const { filterKeyword, filterTaxonomy } = this.state;
        const selectedTaxonomyOptions = this.state.selectedTaxonomyOptions.slice();
        const selectedKeywordsOptions = this.state.selectedKeywordsOptions.slice();
        if (filterKeyword.indexOf(name) === -1) filterKeyword.push(name);
        if (filterTaxonomy.indexOf(name) === -1) filterTaxonomy.push(name);
        const taxOpt1 = this.state.taxonomyOptions.find(x => x.name === name);
        const taxOpt2 = selectedTaxonomyOptions.findIndex(x => x.name === name);
        console.log(taxOpt1, taxOpt2);
        if (taxOpt1 !== undefined && taxOpt2 !== -1) {
            selectedTaxonomyOptions.splice(taxOpt2, 1);
        }
        const keyOpt1 = this.state.keywordsOptions.find(x => x.name === name);
        const keyOpt2 = selectedKeywordsOptions.findIndex(x => x.name === name);
        if (keyOpt1 !== undefined && keyOpt2 !== -1) {
            selectedKeywordsOptions.splice(keyOpt2, 1);
        }
        this.setState({ selectedTaxonomyOptions, selectedKeywordsOptions });
        setTimeout(this.updateChart, 200);
    };

    //filter function for shift+mouseclick
    //Mouse interaction-2
    addFilterShift = (name) => {
        const taxOpt1 = this.state.taxonomyOptions.find(x => x.name === name);
        if (taxOpt1 !== undefined) {
            const { filterTaxonomy } = this.state;
            for (let tax1 of this.state.taxonomyOptions) {
                if (tax1.name !== name && filterTaxonomy.indexOf(tax1.name) === -1) filterTaxonomy.push(tax1.name);
            }
            const selectedTaxonomyOptions = [];
            console.log(taxOpt1);
            selectedTaxonomyOptions.push(taxOpt1);
            this.setState({ selectedTaxonomyOptions });
            setTimeout(this.updateChart, 200);
        }
        const keyOpt1 = this.state.keywordsOptions.find(x => x.name === name);
        if (keyOpt1 !== undefined) {
            const { filterKeyword } = this.state;
            for (let opt1 of this.state.keywordsOptions) {
                if (opt1.name !== name && filterKeyword.indexOf(opt1.name) === -1) filterKeyword.push(opt1.name);
            }
            const selectedKeywordsOptions = [];
            selectedKeywordsOptions.push(keyOpt1);
            this.setState({ selectedKeywordsOptions });
            setTimeout(this.updateChart, 200);
        }
    };

    //filter function for control+mouseclick
    //Mouse interaction-3
    addFilterControl =(name) => {
        const taxOpt1 = this.state.taxonomyOptions.find(x => x.name === name);
        if (taxOpt1 !== undefined) {
            const { filterTaxonomy } = this.state;
            for (let tax1 of this.state.taxonomyOptions) {
                if (tax1.name !== name && filterTaxonomy.indexOf(tax1.name) === -1) filterTaxonomy.push(tax1.name);
            }
            const selectedTaxonomyOptions = [];
            selectedTaxonomyOptions.push(taxOpt1);
            this.setState({ 
                selectedTaxonomyOptions, 
                selectedKeywordsOptions: this.state.keywordsOptions.slice(),
                filterTaxonomy,
                filterKeyword: [],
            });
            setTimeout(this.updateChart, 200);
        }
        const keyOpt1 = this.state.keywordsOptions.find(x => x.name === name);
        if (keyOpt1 !== undefined) {
            const { filterKeyword } = this.state;
            for (let opt1 of this.state.keywordsOptions) {
                if (opt1.name !== name && filterKeyword.indexOf(opt1.name) === -1) filterKeyword.push(opt1.name);
            }
            const selectedKeywordsOptions = [];
            selectedKeywordsOptions.push(keyOpt1);
            this.setState({ 
                selectedKeywordsOptions, 
                selectedTaxonomyOptions: this.state.taxonomyOptions.slice(),
                filterTaxonomy: [],
                filterKeyword,
            });
            setTimeout(this.updateChart, 200);
        }
    };

   

    importJSON() {
        const ranks = {}
        const categories = {}
        const master = {}
        const rankList = []
        const categoryList = []

                    this.setState({
                        TAXONOMY_DATA: this.props.value ? this.props.value : {},
                    })
                    const taxonomydata = this.state.TAXONOMY_DATA
                    taxonomydata.forEach(d => {
                        const rank = d.taxonomyRank;
                        const keyword = d.keywordCategory;

                        ranks[rank] = true;
                        categories[keyword] = true;
                        if (!master[rank]) {
                            master[rank] = {}
                        }
                        if (!master[rank][keyword]) {
                            master[rank][keyword] = []
                        }

                        master[rank][keyword].push(d);
                    })

                    for (let key in ranks) {
                        if (ranks.hasOwnProperty(key)) {
                            rankList.push(key);
                        }
                    }

                    for (let key in categories) {
                        if (categories.hasOwnProperty(key)) {
                            categoryList.push(key);
                        }
                    }
                    this.setState({
                        rankList,
                        categoryList,
                        master,
                        selectedRank: this.props.selectedRank,
                        selectedCategory: this.props.selectedCategory,
                    }, () => {
                        this.updateList()
                        
                    });
                          
    }

    // 1 - parse the data to get the list of ranks and categories
    // create taxonomy/keyword list
    updateList() {
        const ranks = {}
        const categories = {}
        const master = {}
        this.state.TAXONOMY_DATA.forEach(d => {
            const rank = d.taxonomyRank;
            const keyword = d.keywordCategory;

            ranks[rank] = true;
            categories[keyword] = true;
            if (!master[rank]) {
                master[rank] = {}
            }
            if (!master[rank][keyword]) {
                master[rank][keyword] = []
            }

            master[rank][keyword].push(d);
        })

        // temporary dictionary
        const keywords = {}
        const taxonomies = {}
        const { selectedRank, selectedCategory, duration } = this.state
        console.log(`master[${selectedRank}][${selectedCategory}]`)

        if (master && master[selectedRank] && master[selectedRank][selectedCategory]) {
           const filterdata = master[selectedRank][selectedCategory]
           const filterdata1 = master[selectedRank][selectedCategory]
           const keywords1 = filterdata.map(d => d.keywordName).filter(function(item, i, ar){ return ar.indexOf(item) === i; });
           const taxonomies1 = filterdata1.map(d => d.taxonomyName).filter(function(item, i, ar){ return ar.indexOf(item) === i; });

        //Function to splice data with total spectra count value less than duration
   
        var removedkey = [];
        function findAndRemove(array, property, value) {
            array.forEach(function(result, index) {
           if(result[property] === value) {
          //Remove from array
            var removedItem= array.splice(index, 1);
            removedkey.push(removedItem);
          }    
        });
        }

        var removedtax = [];
        function findAndRemove1(array, property, value){
         var index = array.map(function(x){ return x[property]; }).indexOf(value);
         var removedItem = array.splice(index,1);
         removedtax.push(removedItem);
        }        

        for(var i =0; i<keywords1.length; i++){
            var count =0 ;
            for(var j=0; j<filterdata.length; j++){
               
                if(filterdata[j].keywordName === keywords1[i]){
                    count = count + filterdata[j].spectCount;
                }   
             }
             if(count < duration){
                findAndRemove(filterdata, 'keywordName', keywords1[i]);
             }
        }

        for(var k =0; k<taxonomies1.length; k++){
            var count1 =0 ;
            for(var l=0; l<filterdata1.length; l++){
                
                if(filterdata1[l].taxonomyName === taxonomies1[k]){
                    count1= count1 + filterdata1[l].spectCount;
                }   
             }
             if(count1 < duration){
                findAndRemove1(filterdata1, 'taxonomyName', taxonomies1[k]);
             }
        }

               
        const displayItems = [...new Set([...filterdata ,...filterdata1])];

            filterdata.forEach(d => {
                keywords[d.keywordId] = d.keywordName;
                taxonomies[d.taxId] = d.taxonomyName;
            })

            const keywordsOptions = Object.keys(keywords).map(key => { return { id: key, name: keywords[key] }; });
            const taxonomyOptions = Object.keys(taxonomies).map(key => { return { id: key, name: taxonomies[key] }; });

            this.setState({
                keywordsOptions,
                displayItems,
                removedItemskey: removedkey,
                removedItemstax:removedtax,
                selectedKeywordsOptions: keywordsOptions.slice(),
                taxonomyOptions,
                selectedTaxonomyOptions: taxonomyOptions.slice(),
                filterKeyword: [],
                filterTaxonomy: [],
            }, () => {
                this.updateChart();
                this.onchangeCategory();
                this.onchangeRank();
                
            });
        }
    }

    updateChart() {
        const { filterKeyword, filterTaxonomy, displayItems, removedItemskey, removedItemstax } = this.state;
        //const data = master[selectedRank][selectedCategory]
        const removedItemstax1 = [].concat.apply([], removedItemstax);
        console.log(removedItemstax1)
        const removedItemskey1 = [].concat.apply([], removedItemskey);
        console.log(removedItemskey1)

        for(var i =0 ; i<removedItemstax1.length; i++){
            removedItemstax1[i].taxonomyName="Other Taxonomy";
            removedItemstax1[i].taxId="1";
          } 

        for(var j =0 ; j<removedItemskey1.length; j++){
            removedItemskey1[j].keywordName="Other Keyword";
            removedItemskey1[j].keywordId="KW-0001";          
        }
        
        var removedItems = [...new Set([...removedItemstax1 ,...removedItemskey1])];

        const data = [...new Set([...this.state.removedItems ,...displayItems])];
        //console.log(data)
       
        if (data) {
          const filteredData = data.filter(row => filterTaxonomy.indexOf(row.taxonomyName) === -1
              && filterKeyword.indexOf(row.keywordName) === -1);           
            this.child.drawChords(filteredData);
       }
    };

    componentDidMount() {
        this.setState({ isComponentMount: true });
        this.importJSON();
        setInterval(this.change, 300000)
    }

    handleSubmitBtnClick = () => {
        const { filterKeyword, filterTaxonomy, selectedKeywordsOptions, selectedTaxonomyOptions } = this.state;
        const filter1 = this.state.taxonomyOptions.filter(x => selectedTaxonomyOptions.indexOf(x) === -1);
        
        while (filterTaxonomy.length > 0) filterTaxonomy.pop();
        filter1.forEach(item => {
            const { name } = item;
            if (filterTaxonomy.indexOf(name) === -1) filterTaxonomy.push(name);
        });
        const filter2 = this.state.keywordsOptions.filter(x => selectedKeywordsOptions.indexOf(x) === -1);
        
        while (filterKeyword.length > 0) filterKeyword.pop();
        filter2.forEach(item => {
            const { name } = item;
            if (filterKeyword.indexOf(name) === -1) filterKeyword.push(name);
        });
        this.updateChart();
        this.change();
    }
    handleResetBtnClick = () => {
        this.setState({
            filterKeyword: [],
            filterTaxonomy: [],
            selectedKeywordsOptions: this.state.keywordsOptions.slice(),
            selectedTaxonomyOptions: this.state.taxonomyOptions.slice(),
            duration: 1,
        });
        setTimeout(this.updateChart, 500);
        
        this.importJSON();

        const url = 'http://localhost:8080/visualization/interact/reset';
        axios.get(url).then( res => {
        const data = res.data.data;
        console.log(data)
        if(data === 'successful'){
          this.props.importJSON();
          this.importJSON();
          alert("Reset Completed!");        }
      })
    }

    taxdel(){
        const { selectedTaxonomyOptions } = this.state;
        const taxfilter = this.state.taxonomyOptions.filter(x => selectedTaxonomyOptions.indexOf(x) === -1);

        if (taxfilter.length > 0){
            for (var i = 0; i < taxfilter.length; i++){
             axios.post('http://localhost:8080/visualization/interact/taxonomy/update', 
             { taxId: taxfilter[i].id,  visibility: 'False' })
               .then( res => {
                const data = res.data.data;
                console.log('Changed Taxonomy visibility to False',data)    
                })
                .catch(function (error) {
                 console.log(error);
                });
             }
               
         }
    }

    keydel(){
        const { selectedKeywordsOptions } = this.state;
        const keyfilter = this.state.keywordsOptions.filter(x => selectedKeywordsOptions.indexOf(x) === -1);

        if (keyfilter.length > 0){
            for (var i = 0; i < keyfilter.length; i++){
             axios.post('http://localhost:8080/visualization/interact/keyword/update', 
             { keywordId: keyfilter[i].id,  visibility: 'False' })
               .then( res => {
                const data = res.data.data;
                console.log('Changed keyword visibility to false.',data)    
                })
                .catch(function (error) {
                 console.log(error);
                });
             }
               
         }
    }

    taxadd(){
        const { selectedTaxonomyOptions } = this.state;
        if (selectedTaxonomyOptions.length > 0){
            for (var i = 0; i < selectedTaxonomyOptions.length; i++){
             axios.post('http://localhost:8080/visualization/interact/taxonomy/update', 
             { taxId: selectedTaxonomyOptions[i].id,  visibility: 'True' })
               .then( res => {
                const data = res.data.data;
                console.log('Changed Taxonomy visibility to True',data)    
                })
                .catch(function (error) {
                 console.log(error);
                });
             }
               
         }
    }

    keyadd(){
        const { selectedKeywordsOptions } = this.state;
        if (selectedKeywordsOptions.length > 0){
            for (var i = 0; i < selectedKeywordsOptions.length; i++){
             axios.post('http://localhost:8080/visualization/interact/keyword/update', 
             { keywordId: selectedKeywordsOptions[i].id,  visibility: 'True' })
               .then( res => {
                const data = res.data.data;
                console.log('Changed keyword visibility to True.',data)    
                })
                .catch(function (error) {
                 console.log(error);
                });
             }
               
         }
    }

    change(){
        this.taxdel()
        this.keydel()
        this.taxadd()
        this.keyadd()
    }

    onchangeRank(){
        this.props.onchangeRank(this.state.selectedRank)
    }
    
    onchangeCategory(){
        this.props.onchangeCategory(this.state.selectedCategory)
    }

    render = () => {
        let state = this.state;
        const { visible, rankList, categoryList, selectedRank, selectedCategory, duration } = this.state
       // console.log(this.state.selectedTaxonomyOptions)

        return <div>
            
            <Sidebar.Pushable as={Segment}>
                <Button onClick={this.toggleVisibility} icon className="navbar-toggle">
                    <Icon name="align justify" />
                </Button>
                <Sidebar as={Menu} animation="overlay" width="very wide" direction="right" visible={visible} icon="labeled" vertical inverted>
                    <Icon className="close" size="large" onClick={this.toggleVisibility} />
                    <div className="row mt-50" />
                    
                    <Form.Input
                      // eslint-disable-next-line
                      label={`Spectra Count Range:  ${duration}` + "\u00A0" + "\u00A0" + "\u00A0" + "\u00A0" + "\u00A0"}
                      min={1}
                      max={9999}
                      name='duration'
                      value={duration}
                      step={10}
                      type='range'
                      onChange={(event) => {
                            //console.log(e.target.value);
                            this.setState({ duration: event.target.value });
                            setTimeout(this.updateList.bind(this), 100);
                        }} />
                        <Form.Input 
                        // eslint-disable-next-line
                        label={`Spectra Count Value: ` + "\u00A0" + "\u00A0" + "\u00A0" + "\u00A0" + "\u00A0"}
                        placeholder='Spectra Count' 
                        value={duration} 
                        onChange={(event) => {
                            this.setState({ duration: event.target.value });
                            setTimeout(this.updateList.bind(this), 100);
                        }} />

                    <div className="row mt-20">
                        <div className="col-sm-6">
                            <Dropdown placeholder="Select Rank" selection value={selectedRank} options={rankList.map(
                                item => ({ key: item, text: item, value: item })
                            ).sort((a, b) => a.text.toLowerCase() > b.text.toLowerCase() )} onChange={(e, data) => {
                                this.setState(
                                    { selectedRank: data.value },
                                    () => {
                                        this.updateList();
                                    }
                                );
                            }} />
                        </div>
                        <div className="col-sm-6">
                            <Dropdown placeholder="Select Category" selection value={selectedCategory} options={categoryList.map(
                                item => ({ key: item, text: item, value: item })
                            ).sort((a, b) => a.text.toLowerCase() > b.text.toLowerCase() )} onChange={(e, data) => {
                                this.setState(
                                    { selectedCategory: data.value },
                                    () => {
                                        this.updateList();
                                    }
                                );
                            }} />
                        </div>
                    </div>
                    <AddRemoveSelection type="Taxonomy" options={this.state.taxonomyOptions} onChange={selectedTaxonomyOptions => {
                        this.setState({ selectedTaxonomyOptions });
                    }} selectedOptions={this.state.selectedTaxonomyOptions} />
                    <br />
                    <AddRemoveSelection type="Keywords" options={this.state.keywordsOptions} onChange={selectedKeywordsOptions => {
                        this.setState({ selectedKeywordsOptions });
                    }} selectedOptions={this.state.selectedKeywordsOptions} />
                    <div className="row mt-20">
                        <div className="col-sm-12 text-left">
                            <button className="btn btn-primary" id="submit" onClick={this.handleSubmitBtnClick}>
                                Submit
                    </button>
                            <button className="btn btn-danger" id="reset" onClick={this.handleResetBtnClick}>
                                Reset
                    </button>
                        </div>
                    </div>
                </Sidebar>
                <Sidebar.Pusher>
                    <Segment basic>
                        <div className="row" style={{ position: "relative" }}>
                            <div className="large-8 small-12">
                                <article style={{ width: 800, height: 800 }} id="chord">
                                    {
                                        state.isComponentMount ?
                                            <Chord updateTooltip={this.updateTooltip} addFilterShift={this.addFilterShift} addFilterControl={this.addFilterControl} addFilter={this.addFilter} onRef={ref => (this.child = ref)} filters={state.filters}>
                                            </Chord>
                                            : null
                                    }
                                </article>
                            </div>
                            <fieldset id="tooltip" placement="top" className="row">
                                <div className="small-6 small-12 ">
                                    <h6>
                                        {/* Taxonomy Name: {state.tooltip.tname} <br /> Keyword Name: {state.tooltip.kname} <br /> Taxonomy ID: {state.tooltip.tid} <br /> Keyword Visibility: {state.tooltip.kwVizState} <br /> Taxonomy Visibility: {state.tooltip.taxVizState} <br /> Keyword ID: {state.tooltip.kid} <br /> Spect Count: {state.tooltip.tvalue}{" "} */}
                                        Taxonomy Name: {state.tooltip.tname} <br /> Keyword Name: {state.tooltip.kname} <br /> Taxonomy ID: {state.tooltip.tid} <br /> Keyword ID: {state.tooltip.kid} <br /> Spect Count: {state.tooltip.tvalue}{" "}
                                    </h6>
                                </div>
                            </fieldset>
                        </div>
                    </Segment>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </div>;
    }
}
