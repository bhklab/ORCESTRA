import styled from 'styled-components';
import colors from '../../../../styles/colors';

const LayoutContainer = styled.div`

	font-family: 'Roboto', sans-serif;

    .content-row {
		display: flex;
		flex-direction: row;
		gap: 20px;
        width: 100%;
    }

	@media screen and (max-width: 800px) {
		.content-row {
			flex-direction: column;
			align-items: center;
		}
	}

	.card-title {
		font-size: 26px;
		font-weight: bolder;
	}

	.description{
		margin: 0 0 3px 0;
		padding: 0 5px;
		color: ${colors.standard_light_blue};
	}

	.subsection{
		padding: 2px 0;
	}

	.list-style-card-main {
		list-style-type: none;
		margin: 0;
		padding: 0 0 0 10px;
		color: ${colors.standard_light_blue};
	}

	.list-style-card-sub{
		list-style-type: disc;
		margin: 0;
		span {
			font-weight: bold;
		}
	}

	span {
		font-weight: bolder;
	}

	h2{
		font-size: 18px;
		margin: 10px 0;
	}
`;

const StyledContainer = styled.div`
	display: flex;
	flex-direction: column;
	font-size: 14px;
	margin-bottom: 20px;
	max-width: 40%;

	@media screen and (max-width: 800px) {
		max-width: 90%;
	}

	.card-container {
		background-color: #f9f9f9;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 20px;
	}

	.hr-container{
		margin: 0 0 15px 0;
	}
	.hr-style {
		margin 0 auto;
		color: ${colors.light_gray};
	}

	.button-container{
		display: flex;
		gap: 10px;
	}
	.list-style-card-main {
        padding-left: 20px;
        margin-top: 10px;
    }
    .list-style-card-sub {
        padding-left: 15px;
    }

	.download-button {
        display: flex;
        align-items: center;
        padding: 10px 12px;
		height: 30px;
        border: none;
		font-size: 10px;
        border-radius: 4px;
		background-color: ${colors.standard_dark_blue};
        color: white;
        cursor: pointer;
        transition: transform 0.3s, box-shadow 0.3s;
		max-width: 175px;
		margin-top: 10px;

        &:hover {
            background: #464c77;
            transform: scale(1.02);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        &:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
        }
    }
	
`;

const StyledTopBar = styled.div`
    align-items: left;
	text-align: left;
    width: 100%;

    .title {
        font-size: 50px;
        text-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
    }

`;


export {
	LayoutContainer,
	StyledContainer,
	StyledTopBar,

}