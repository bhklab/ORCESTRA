import React from 'react';
import {ScrollPanel} from 'primereact/scrollpanel';
import './Tutorial.css';

const Tutorial = (props) => {
    return(
        <React.Fragment>
            <div className='pageContent'>
                <div className='tutorial-container'>
                    <h2>Generating PSet with Your Data</h2>
                    <ScrollPanel className='tutorial-scroll'>
                        <div className='tutorial-text'>
                            If you would like to generate a PSet with your own data, plase submit the data to <b>support@orcestra.ca</b>. <br />
                            Please ensure your data submission follows the respective format below:<br />
                            The following are a list of requirements that must be fulfilled in order to successfully generate a PharmacoSet (PSet) object in PharmacoGx:
                        </div>
                        <ol className='tutorial-list'>
                            <li>
                                <h2>Cell line annotation</h2>
                                <div className='tutorial-text'>
                                    Please provide the number of cell lines that will be utilized, along with their respective cell line ID’s (e.g. 184A1, 22RV1).
                                </div>    
                            </li> 
                            <li>
                                <h2>Drug annotation</h2>
                                <div className='tutorial-text'>
                                    Please provide the number of drugs that will be utilized, along with their respective  drug ID’s (preferably PubChem) (e.g. lapatinib).
                                </div> 
                            </li> 
                            <li>
                                <h2>Tissue annotation</h2>
                                <div className='tutorial-text'>
                                    Tissue types for each cell line ID provided (e.g. breast).
                                </div> 
                            </li> 
                            <li>
                                <h2>Cell line metadata</h2>
                                <div className='tutorial-text'>
                                    Metadata for each cell ID (e.g. transcriptional subtype for each cell id).
                                </div> 
                            </li>   
                            <li>
                                <h2>Drug metadata</h2>
                                <div className='tutorial-text'>
                                    Metadata for each drug ID.
                                </div> 
                            </li>  
                            <li>
                                <h2>Processed drug response data</h2>
                                <div className='tutorial-text'>
                                    <ol>
                                        <li>
                                            <div>
                                                Sensitivity info (cell line id and drug id for each cell line and drug pair used in sensitivity measurements, minimum and maximum drug dose for each cell line and drug pair, number of concentrations tested for each cell line and drug pair).
                                            </div>
                                            <img  src={process.env.PUBLIC_URL + "/images/tutorial/sensitivity.png"} alt='' />
                                        </li> 
                                        <li>
                                            <div>
                                                Raw Sensitivity (Drug dose values for each cell line and drug pair, along with their respective viability values).
                                            </div>
                                            <h4>Doses</h4>
                                            <img  src={process.env.PUBLIC_URL + "/images/tutorial/doses.png"} alt='' />
                                            <h4>Viability</h4>
                                            <img  src={process.env.PUBLIC_URL + "/images/tutorial/viability.png"} alt='' />
                                        </li>
                                        <li>
                                            <div>
                                                Sensitivity Profiles (AAC, IC50, EC50, Einf etc values for each cell line and drug pair)
                                            </div>
                                            <img  src={process.env.PUBLIC_URL + "/images/tutorial/sensitivity_profiles.png"} alt='' />
                                        </li>       
                                    </ol> 
                                    <p>
                                        Note: Please ensure sensitivity info, profiles, and raw sensitivity are in an organized data frame in R.
                                    </p>       
                                </div>
                            </li> 
                            <li>
                                <h2>Processed molecular profiles</h2>
                                <div className='tutorial-text'>
                                    <ol>
                                        <li>
                                            Please provide the processed molecular data you would like to include in the PSet (e.g Kallisto h5 abundance files), along with processing details (e.g. reference genome, transcriptome).
                                        </li>
                                        <li>
                                            Phenotypic (e.g. batch ids) and feature data (e.g. gencode gene id) for each cell line used in the molecular profiles.
                                        </li>
                                    </ol>    
                                </div> 
                            </li> 
                        </ol>
                    </ScrollPanel>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Tutorial