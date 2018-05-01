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
import Header from '../Header'

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
            groupedData: {},
            params: {
                test: new Header(),
            }
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
        this.grouping = this.grouping.bind(this);
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
            //console.log(taxOpt1);
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

        return fetch("https://bitbucket.org/rohitkalva/viz/raw/57fded0791bdeefd5b2def0deab7ea89b3077dce/fulldata_sort.json")
           // http://localhost:8080/visualization/chord/fulldata
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    TAXONOMY_DATA: responseJson.fulldata,
                }, () => {
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
                    //console.log('rankList', rankList)
                    //console.log('categoryList', categoryList)
                    //console.log('master', master)

                    this.setState({
                        rankList,
                        categoryList,
                        master,
                        selectedRank: "phylum",
                        selectedCategory: "Ligand",
                    }, () => {
                        this.updateList()
                    });
                })
            })

    }

    // 1 - parse the data to get the list of ranks and categories
    // create taxonomy/keyword list
    updateList() {
        // temporary dictionary
        const keywords = {}
        const taxonomies = {}
        const { master, selectedRank, selectedCategory, duration } = this.state
        console.log(`master[${selectedRank}][${selectedCategory}]`)

        if (master && master[selectedRank] && master[selectedRank][selectedCategory]) {
           // console.log(`master[${selectedRank}][${selectedCategory}]`, master[selectedRank][selectedCategory])
           
            const filterdata = master[selectedRank][selectedCategory].filter(row => row.spectCount >= duration)
            filterdata.forEach(d => {
                keywords[d.keywordId] = d.keywordName;
                taxonomies[d.taxId] = d.taxonomyName;
            })

            const keywordsOptions = Object.keys(keywords).map(key => { return { id: key, name: keywords[key] }; });
            const taxonomyOptions = Object.keys(taxonomies).map(key => { return { id: key, name: taxonomies[key] }; });

            this.setState({
                keywordsOptions,
                selectedKeywordsOptions: keywordsOptions.slice(),
                taxonomyOptions,
                selectedTaxonomyOptions: taxonomyOptions.slice(),
                filterKeyword: [],
                filterTaxonomy: [],
            }, () => {
                this.updateChart()
                //this.grouping();
            });
        }
    }

    // Grouping function to group data set below slider value
    grouping(){
        const keywords = {}
        const taxonomies = {}
        const { master, selectedRank, selectedCategory, duration } = this.state

        const groupdata = master[selectedRank][selectedCategory].filter(row => row.spectCount < duration)
            groupdata.forEach(d => {
                keywords[d.keywordId] = d.keywordName;
                taxonomies[d.taxId] = d.taxonomyName;
            })
            
            console.log("Test Data", groupdata)

            const tax = groupdata.map(d => d.taxonomyName);
            const key = groupdata.map(d =>d.keywordName);
            var jsonStr = JSON.stringify(groupdata)
            for(var i =0 ; i<groupdata.length; i++){     
                jsonStr= jsonStr.toString().replace(tax[i], "Other Taxonomy");
            }          

            for(var j =0; j<groupdata.length; j++){
                jsonStr= jsonStr.toString().replace(key[j], "Other Keyword");
            }
            const groupedData = JSON.parse(jsonStr)

            //console.log("Modified Data", groupedData)

            this.setState({
                groupedData,
            }, () => {
                this.updateChart();
            })
    }

    updateChart() {
        const { master, selectedRank, selectedCategory, filterKeyword, filterTaxonomy, duration } = this.state;
        const data = master[selectedRank][selectedCategory];
        //console.log(selectedRank, selectedCategory, data, filterTaxonomy, filterKeyword);

        if (data) {
            const filteredData = data.filter(row => filterTaxonomy.indexOf(row.taxonomyName) === -1
                && filterKeyword.indexOf(row.keywordName) === -1).filter(row => row.spectCount >= duration);
            //const finalData = Object.assign(filteredData,groupedData)
            //console.log("Final Data", finalData);
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
        //console.log(filter1, this.state.taxonomyOptions, selectedTaxonomyOptions);
        //console.log(filter1)        
        while (filterTaxonomy.length > 0) filterTaxonomy.pop();
        filter1.forEach(item => {
            const { name } = item;
            if (filterTaxonomy.indexOf(name) === -1) filterTaxonomy.push(name);
        });
        const filter2 = this.state.keywordsOptions.filter(x => selectedKeywordsOptions.indexOf(x) === -1);
        //console.log(selectedKeywordsOptions)
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
        });
        setTimeout(this.updateChart, 100);

        const url = 'http://localhost:8080/visualization/interact/reset';
        axios.get(url).then( res => {
        const data = res.data.data;
        console.log(data)
        if(data === 'successful'){
          this.importJSON()
        }
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

    //addchange(){
   //     setInterval(this.taxadd, 10000);
   // }

    change(){
        //const { filterKeyword, filterTaxonomy, selectedKeywordsOptions, selectedTaxonomyOptions } = this.state;
        //const taxfilter = this.state.taxonomyOptions.filter(x => selectedTaxonomyOptions.indexOf(x) === -1);
        //const keyfilter = this.state.keywordsOptions.filter(x => selectedKeywordsOptions.indexOf(x) === -1);
        this.taxdel()
        this.keydel()
        this.taxadd()
        this.keyadd()
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
                      label={`least Spectra Count range  value : ${duration}` + "\u00A0" + "\u00A0" + "\u00A0" + "\u00A0" + "\u00A0"}
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
