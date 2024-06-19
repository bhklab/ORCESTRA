import React, { Fragment } from 'react';
import { TabHeader, TabContent } from '../../SingleDatasetStyle';
import styled from 'styled-components';

const PipelineContent = styled.div`
    display: flex;
    align-items: ${props => (props.alignTop ? 'baseline' : 'center')};
    h3 {
        margin-right: 10px;
    }
    .pipeline-execution {
        margin-left: 10px;
        line-height: 15px;
    }
`;

const PipelineTabContent = props => {
    const { data } = props;

    const getCommitLink = (gitURL, commitId) => {
        let link = gitURL.replace('.git', '/tree/');
        return link.concat(commitId);
    };

    return (
        <Fragment>
            <TabHeader>XevaSet Pipeline</TabHeader>
            <TabContent>
                {data.pipeline.url && (
                    <div>
                        <PipelineContent>
                            <h3>Repository:</h3>
                            <div>{data.pipeline.url}</div>
                        </PipelineContent>
                        <PipelineContent>
                            <h3>Commit:</h3>
                            <div>
                                <a href={getCommitLink(data.pipeline.url, data.pipeline.commit_id)}>
                                    {data.pipeline.commit_id}
                                </a>
                            </div>
                        </PipelineContent>
                    </div>
                )}
            </TabContent>
        </Fragment>
    );
};

export default PipelineTabContent;
