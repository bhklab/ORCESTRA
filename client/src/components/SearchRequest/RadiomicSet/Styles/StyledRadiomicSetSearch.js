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
		text-align: center;

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
`;

const StyledContainerOuter = styled.div`
    width: 33%;
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

	.hr-container{
		margin: 0 0 15px 0;
		justify-content: center;
	}
	.hr-style {
		margin 0 auto;
		max-width: 200px;
		color: ${colors.standard_dark_blue};
	}
	
`;

const StyledContainerInner = styled.div`
    width: 33%;
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

	.hr-container{
		margin: 0 0 15px 0;
		justify-content: center;
	}
	.hr-style {
		margin 0 auto;
		max-width: 150px;
		color: ${colors.standard_dark_blue};
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
        transition: transform 0.3s, box-shadow 0.3s;

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


export {
	LayoutContainer,
	StyledContainerOuter,
	StyledContainerInner,
	StyledTopBar,

}