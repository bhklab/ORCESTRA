import React, { Fragment } from 'react';
import { TabHeader, TabContent } from '../../SingleDatasetStyle';
import styled from 'styled-components';

const PipelineContent = styled.div`
    display: flex;
    align-items: ${props => props.alignTop ? 'baseline' : 'center'};
    h3 {
        margin-right: 10px;
    }
    .pipeline-execution {
        margin-left: 10px;
        line-height: 15px;
    }
`

const PipelineTabContent = props => {
    const getCommitLink = (gitURL, commitId) => {
        let link = gitURL.replace('.git', '/tree/');
        return link.concat(commitId);
    }

    return(
        <Fragment>
            <TabHeader>Pipeline Data</TabHeader>
            <TabContent>
                <PipelineContent>
                    <h3>Repository:</h3>
                    <div>{props.data.pipeline.url}</div>
                </PipelineContent>
                <PipelineContent>
                    <h3>Commit:</h3>
                    <div><a href={getCommitLink(props.data.pipeline.url, props.data.pipeline.commit_id)}>{props.data.pipeline.commit_id}</a></div>
                </PipelineContent>
                {
                    props.data.additionalRepo.length > 0 &&
                    <Fragment>
                        <h3>Additional Repositories Used in this Pipeline:</h3>
                        <div className='indent'>
                        {
                            props.data.additionalRepo.map((repo, i) => (
                                <PipelineContent key={i}>
                                    <h3>{repo.repo_type}:</h3> 
                                    <div>
                                        <a href={getCommitLink(repo.git_url, repo.commit_id)}>
                                            {getCommitLink(repo.git_url, repo.commit_id)}
                                        </a>
                                    </div>
                                </PipelineContent>
                            ))
                        }
                        </div>
                    </Fragment>
                }
            </TabContent>
        </Fragment> 
    )
}

export default PipelineTabContent