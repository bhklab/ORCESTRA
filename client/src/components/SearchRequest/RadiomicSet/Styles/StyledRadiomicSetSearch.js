import styled from 'styled-components';
import colors from '../../../../styles/colors';

const LayoutContainer = styled.div`
	flex-direction: row;
	justify-content: space-between
    align-items: center;
    background-color: transparent;
    width: 95%;
	padding: 40px 30px;
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
	}

	.list-style-card-main {
		list-style-type: none;
		padding-left: 0;
		margin: 0;

		span {
			font-weight: bold;
		}
	}

	.list-style-card-sub{
		list-style-type: disc;
		padding-left: 20px;
		margin: 0;
		span {
			font-weight: bold;
		}
	}

	.hr-style {
		margin: 5px 0 10px 0;
		color: red;
	}

`;

const StyledContainerOuter = styled.div`
    width: 25%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    font-size: 12px;

	.card-container {
		border-radius: 8px;
		padding: 15px;
		box-shadow: 0 2px 5px rgba(0,0,0,0.6);
		min-height: 180px;
		background-color: white;

		transition: transform 0.3s, box-shadow 0.3s;
	}

	.card-container:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 20px rgba(0, 0, 0, 1);
	}
	
`;

const StyledContainerInner = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    font-size: 12px;

    .card-container {
		border-radius: 8px;
		padding: 15px;
		box-shadow: 0 2px 5px rgba(0,0,0,0.6);
		min-height: 180px;
		background-color: white;

		transition: transform 0.3s, box-shadow 0.3s;
	}

	.card-container:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 20px rgba(0, 0, 0, 1);
	}
	
`;


const StyledTopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 400px;
    padding: 10px 25px;
    border-radius: 5px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
    background: ${colors.standard_dark_blue};
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    }

    .title {
        font-family: 'Roboto', sans-serif;
        font-size: 28px;
        margin: 0;
        color: ${colors.standard_light_blue};
        font-weight: 500;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }

    .download-button {
        display: flex;
        align-items: center;
        height: 35px;
        padding: 5px 15px;
        border: 1px solid ${colors.standard_light_blue};
        border-radius: 25px;
        font-weight: 600;
        background-color: transparent;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;

        i {
            margin-right: 5px; // Space between the icon and label
            font-size: 16px;
        }

        &:hover {
            background-color: ${colors.standard_light_blue};
            color: ${colors.standard_dark_blue};
        }
    }
`;


export {
	LayoutContainer,
	StyledContainerOuter,
	StyledContainerInner,
	StyledTopBar,

}