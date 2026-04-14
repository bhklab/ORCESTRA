import styled from 'styled-components';
import colors from '../../../../styles/colors';

const LayoutContainer = styled.div`
	flex-direction: row;
	justify-content: space-between
    align-items: center;
    background-color: transparent;
    width: 100%;
	padding: 40px 0px;
	font-family: 'Roboto', sans-serif;

	@media (max-width: 800px) {
		flex-direction: column;
	}

    .content-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
		gap: 20px;
        width: 100%;
    }

	.main-details {
        flex-grow: 1;
        flex-shrink: 1;
    }

	.card-title {
		font-size: 20px;
		font-weight: bolder;
		text-align: center;

	}

	span {
		font-weight: bold;
		font-size: 15px;
	}

	.list-style-card-main {
		list-style-type: none;
		padding-left: 0;
		margin: 0;

		a:hover {
			color: black;
			border-bottom: 2px solid rgb(241, 144, 33);
		}
	}

	.list-style-card-sub{
		list-style-type: disc;
		padding-left: 20px;
		margin: 0;
	}

	.list-style-card-info{
		list-style-type: none;
		padding-left: 10px;
		margin: 0;

	}

	.plot-container {
		border-radius: 8px;
		padding: 25px;
		box-shadow: 0 2px 5px rgba(0,0,0,0.6);
		background-color: white;
		font-size: 14px;
		transition: transform 0.3s, box-shadow 0.3s;
		position: relative;
	}
	.hr-container{
		margin: 0 0 15px 0;
		justify-content: center;
	}
	.hr-style {
		margin 0 auto;
		max-width: 200px;
		color: ${colors.standard_dark_blue};
	}

	a {
		text-decoration: none;
	}

	.pipeline-hover:hover {
		border-bottom: 2px solid rgb(241, 144, 33);
	}

	a:link, a:visited {
		color: inherit;
	}

`;

const StyledContainerOuter = styled.div`
    width: 30%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    font-size: 14px;

    .card-container {
        border-radius: 8px;
        padding: 25px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.6);
        background-color: white;
        font-size: 14px;
        transition:
            transform 0.3s,
            box-shadow 0.3s;
        position: relative;
    }

    .card-container:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 1);
    }

    /* Collapsing behavior */
    .card-container.collapsed .description-expanded {
        max-height: 0;
        overflow: hidden;
        opacity: 0;
    }

    .card-container.expanded .description-expanded {
        overflow: visible;
    }

    .description-expanded {
        transition:
            max-height 0.4s ease,
            opacity 0.3s ease;
    }

    /* Button styling */
    .expand-button {
        margin-top: 12px;
        background: none;
        border: none;
        color: #2563eb; /* blue-ish */
        cursor: pointer;
        font-weight: 500;
        padding: 0;
    }

    .expand-button:hover {
        text-decoration: underline;
    }
    .pipeline {
        font-weight: 700;
    }

    .commitId {
        font-weight: normal;
        font-size: 13px;
    }
    .citations {
        a {
            color: blue;
        }
        p {
            margin: 0;
            display: inline;
        }
    }
`;

const StyledQualityControl = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 10px;

    .qc-button {
        border: 1px solid #e5e5e5ff;
        background-color: white;
        border-radius: 10px;
        padding: 5px 10px;
        color: ${colors.standard_dark_blue};
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
    }

    .qc-button:hover {
        border: 1px solid rgb(241, 144, 33);
        color: ${colors.standard_dark_blue};
        background-color: white;
    }
`;

const StyledContainerInner = styled.div`
    width: 40%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    font-size: 14px;

    .card-container {
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.6);
        background-color: white;
        font-size: 14px;

        transition:
            transform 0.3s,
            box-shadow 0.3s;
    }

    .card-container:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 1);
    }
`;

const StyledTopBar = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: center;
    width: 100%;
    max-width: 350px;
    padding: 5px 10px;

    .title {
        font-family: 'Roboto', sans-serif;
        font-size: 44px;
        color: ${colors.standard_dark_blue};
        font-weight: 700;
        text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.2);
        margin: 10px 0;
    }

    .download-button {
        display: flex;
        align-items: center;
        padding: 8px 14px;
        border: none;
        font-size: 10px;
        border-radius: 30px;
        background: linear-gradient(45deg, #36589b, ${colors.standard_dark_blue});
        color: white;
        cursor: pointer;
        transition:
            transform 0.3s,
            box-shadow 0.3s;

        &:hover {
            background: linear-gradient(45deg, ${colors.standard_dark_blue}, #36589b);
            transform: scale(1.03);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        &:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
        }
    }
`;

export { LayoutContainer, StyledContainerOuter, StyledContainerInner, StyledTopBar, StyledQualityControl };
