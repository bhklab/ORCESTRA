import React from 'react';
import './Stats.css';
import Navigation from '../Navigation/Navigation';
import {Messages} from 'primereact/messages';
import PSetTable from '../Shared/PSetTable';
import SavePSetButton from '../Shared/Buttons/SavePSetButton';
import DownloadPSetButton from '../Shared/Buttons/DownloadPSetButton';
import * as APICalls from '../Shared/APICalls';
import * as APIHelper from '../Shared/PSetAPIHelper';
import {AuthContext} from '../../context/auth';
import DownloadChart from './DownloadChart';

class Stats extends React.Component{
    constructor(){
        super();
        this.state = {
            allData: [],
            chartData: {},
            selectedPSets: [],
            disableBtn: true,
            isReady: false
        }
        this.updatePSetSelection = this.updatePSetSelection.bind(this);
        this.showMessages = this.showMessages.bind(this);
        this.initializeState = this.initializeState.bind(this);
    }

    static contextType = AuthContext;

    componentDidMount(){
        APICalls.queryPSet('/pset/sort', (resData) => {
            const data = [];
            const name = [];
            const value = [];
            for(let i = 0; i < resData.length; i++){
                data.push({name: resData[i].name, value: resData[i].download});
                name.push(resData[i].name);
                value.push(resData[i].download);
                if(i >= 9){
                    break;
                }
            }
            this.setState({
                allData: resData,
                chartData: {data: data, name: name, value: value},
                isReady: true
            });
        });
    }

    updatePSetSelection(selected){
        this.setState({selectedPSets: selected}, () => {
            if(APIHelper.isSelected(this.state.selectedPSets)){
                this.setState({disableBtn: false});
            }else{
                this.setState({disableBtn: true});
            }
        });
    }

    showMessages(status, data){
        APIHelper.messageAfterRequest(status, data, this.initializeState, this.messages);
        APICalls.queryPSet('/pset/sort', (resData) => {
            this.setState({
                allData: resData
            });
        });
    }

    initializeState(){
        this.setState({
            selectedPSets: [],
            disableBtn: true
        });
    }
    
    render(){
        return(
            <React.Fragment>
                <Navigation routing={this.props} />
                <div className='pageContent'>
                    <h1>PSet Usage and Downloads</h1>
                    <div className='statContainer'>
                        <div className='container rankingTable'>
                            <h3>Download Ranking</h3>
                            <Messages ref={(el) => this.messages = el} />
                            <PSetTable allData={this.state.allData} selectedPSets={this.state.selectedPSets} updatePSetSelection={this.updatePSetSelection} showDownload={true} scrollHeight='340px'/>
                            <div className='rankingTableFooter'>
                                {/* <DownloadPSetButton selectedPSets={this.state.selectedPSets} disabled={this.state.disableBtn} onDownloadComplete={this.showMessages}/> */}
                                <SavePSetButton selectedPSets={this.state.selectedPSets} disabled={this.state.disableBtn} onSaveComplete={this.showMessages} />
                            </div>
                        </div>
                        <div className='container downloadHistogram'>
                            {this.state.isReady && <DownloadChart data={this.state.chartData} title='Number of Downloads' />}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Stats;