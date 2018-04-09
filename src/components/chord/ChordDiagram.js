import React, { Component } from "react";
import { Chord } from "./Chord";
import * as d3 from "d3";
import { Sidebar, Segment, Dropdown, Button, Menu, Icon } from 'semantic-ui-react';
import FilteredMultiSelect from 'react-filtered-multiselect';
import "../../css/style.css";
import "../../css/bootstrap.min.css";
import "../../css/appone.css";

//const TAXONOMY_DATA = require('../../assets/chord.json');


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
    componentDidMount() {
    }

    render() {
        const { options, selectedOptions, type } = this.props
      //  console.log(options, selectedOptions);

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
            rankList: [],
            categoryList: [],
            selectedRank: "",
            selectedCategory: "",
            filterData:{},
            keywordsOptions: [],
            selectedKeywordsOptions: [],
            taxonomyOptions: [],
            selectedTaxonomyOptions: [],
        };

        this.importJSON = this.importJSON.bind(this);
        this.addFilter = this.addFilter.bind(this);
        this.updateChart = this.updateChart.bind(this);
        this.updateTooltip = this.updateTooltip.bind(this);
        this.updateList = this.updateList.bind(this);
    }

    toggleVisibility = () => this.setState({ visible: !this.state.visible })

    updateTooltip = (data) => {
        this.setState({
            tooltip: data
        });
    };

    addFilter = (name) => {
        const { filterKeyword, filterTaxonomy } = this.state;
        const selectedTaxonomyOptions = this.state.selectedTaxonomyOptions.slice();
        const selectedKeywordsOptions = this.state.selectedKeywordsOptions.slice();
        if (filterKeyword.indexOf(name) === -1) filterKeyword.push(name);
        if (filterTaxonomy.indexOf(name) === -1) filterTaxonomy.push(name);
        const taxOpt1 = this.state.taxonomyOptions.find(x => x.name === name);
        const taxOpt2 = selectedTaxonomyOptions.findIndex(x => x.name === name);
       // console.log(taxOpt1, taxOpt2);
        if (taxOpt1 !== undefined && taxOpt2 !== -1) {
            selectedTaxonomyOptions.splice(taxOpt2, 1);
        }
        const keyOpt1 = this.state.keywordsOptions.find(x => x.name === name);
        const keyOpt2 = selectedKeywordsOptions.findIndex(x => x.name === name);
        if (keyOpt1 !== undefined && keyOpt2 !== -1) {
            selectedKeywordsOptions.splice(keyOpt2, 1);
        }
        this.setState({ selectedTaxonomyOptions, selectedKeywordsOptions });
        this.updateChart();
    };

    importJSON() {

        const ranks = {}
        const categories = {}
        const master = {}
        const rankList = []
        const categoryList = []

        //return fetch("https://bitbucket.org/rohitkalva/viz/raw/adce478b74bae4e1204d057b3d0171d52e336648/fulldata_sort.json")
            //http://localhost:3000/fulldata_filter1.json
            // return fetch('https://bitbucket.org/rohitkalva/viz/raw/bc0d90fb1305689008c83d72bd27898c1417d3c8/fulldata_filter.json')
            return fetch("http://localhost:8080/visualization/chord/fulldata")
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

                    // add ranks/categories to list
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
                    console.log('rankList', rankList)
                    console.log('categoryList', categoryList)
                    //console.log('master', master)

                    this.setState({
                        rankList,
                        categoryList,
                        master,
                        selectedRank: rankList[0],
                        selectedCategory: categoryList[0], 
                       // selectedRank: "kingdom",
                       // selectedCategory: "Technical term",
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
        const { master, selectedRank, selectedCategory } = this.state
        console.log(`master[${selectedRank}][${selectedCategory}]`)

        if (master && master[selectedRank] && master[selectedRank][selectedCategory]) {
           // console.log(`master[${selectedRank}][${selectedCategory}]`, master[selectedRank][selectedCategory])
            const filterdata=master[selectedRank][selectedCategory]
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
                this.updateChart();
            });
        }
    }

    updateChart() {
        const { master, selectedRank, selectedCategory, filterKeyword, filterTaxonomy } = this.state;
        const data = master[selectedRank][selectedCategory];
        //console.log(selectedRank, selectedCategory, data, filterTaxonomy, filterKeyword);
        if (data) {
            const filteredData = data.filter(row => filterTaxonomy.indexOf(row.taxonomyName) === -1
                && filterKeyword.indexOf(row.keywordName) === -1);
            //console.log(filteredData);
            this.child.drawChords(filteredData);
        }
    };

    componentDidMount() {
        this.setState({ isComponentMount: true });
        this.importJSON();
    }

    handleSubmitBtnClick = () => {
        const { filterKeyword, filterTaxonomy, selectedKeywordsOptions, selectedTaxonomyOptions } = this.state;
        const filter1 = this.state.taxonomyOptions.filter(x => selectedTaxonomyOptions.indexOf(x) === -1);
        //console.log(filter1, this.state.taxonomyOptions, selectedTaxonomyOptions);
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
    }
    handleResetBtnClick = () => {
        this.setState({
            filterKeyword: [],
            filterTaxonomy: [],
            selectedKeywordsOptions: this.state.keywordsOptions.slice(),
            selectedTaxonomyOptions: this.state.taxonomyOptions.slice(),
        });
        setTimeout(this.updateChart, 100);
    }


    render = () => {
        let state = this.state;
        const { visible, rankList, categoryList, selectedRank, selectedCategory } = this.state
       // console.log(this.state.selectedTaxonomyOptions)

        return <div>
            <Sidebar.Pushable as={Segment}>
                <Button onClick={this.toggleVisibility} icon className="navbar-toggle">
                    <Icon name="align justify" />
                </Button>
                <Sidebar as={Menu} animation="overlay" width="very wide" direction="right" visible={visible} icon="labeled" vertical inverted>
                    <Icon className="close" size="large" onClick={this.toggleVisibility} />
                    <div className="row mt-50" />
                    <div className="row mt-20">
                        <div className="col-sm-6">
                            <Dropdown placeholder="Select Rank" selection value={selectedRank} options={rankList.map(
                                item => ({ key: item, text: item, value: item })
                            )} onChange={(e, data) => {
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
                            )} onChange={(e, data) => {
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
                                            <Chord updateTooltip={this.updateTooltip} addFilter={this.addFilter} onRef={ref => (this.child = ref)} filters={state.filters}>
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