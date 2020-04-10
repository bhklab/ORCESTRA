import React from 'react';

const Search = () => {
    return(
        <div className='documentation'>
            <h1>Search</h1>
                <div>
                    <h3>How to search existing PSets</h3>
                    <p>
                        Existing PSets can be searched on <a href='/PSetSearch'>Search and Request</a> page.<br />
                        User can select different pipeline parameters uder PSet Parameters pane. Each selection of parameters triggers a database search. The search result is displayed on the data table as shown in the figure below.
                    </p> 
                    <div className='img-full'>
                        <img src={process.env.PUBLIC_URL + "/images/documentation/search.png"} alt='' />
                    </div>  
                    <h3>How to view metadata of a PSet</h3>
                    <p>
                        Metadata of a PSet can be viewed by clicking a dataset name on the search table.<br />
                        Explore PSet view is displayed as in the figure below where user can view publications associated with the dataset, and command lines used in the pipeline to generate the PSet.
                    </p> 
                    <div className='img-full'>
                        <img src={process.env.PUBLIC_URL + "/images/documentation/explore_pset.png"} alt='' />
                    </div>
                    <div className='bottom-fill'></div> 
                </div>      
        </div>    
    );
}

export default Search