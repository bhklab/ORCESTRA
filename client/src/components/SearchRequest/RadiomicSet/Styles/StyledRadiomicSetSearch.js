import styled from 'styled-components';
import colors from '../../../../styles/colors';

const LayoutContainer = styled.div`
	flex-direction: row;
	justify-content: space-between;
	background-color: white;
	padding: 25px 40px;
	border-radius: 8px;
	font-family: 'Roboto', sans-serif;

	@media (max-width: 800px) {
		flex-direction: column;
	}

    .content-row {
        display: flex;
        flex-direction: row;
		gap: 20px;
        width: 100%;
    }

	.card-title {
		font-size: 26px;
		font-weight: bolder;
	}

	.description{
		margin: 0 0 3px 0;
		padding: 0 5px;
		border-left: solid 2px ${colors.light_gray};
	}

	.subsection{
		
	}

	.list-style-card-main {
		list-style-type: none;
		margin: 0;
		padding: 0 0 0 10px;
		border-left: solid 2px ${colors.light_gray};
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
		font-size: 22px;
		margin: 10px 0;
	}
`;

const StyledContainer = styled.div`
    width: 30%;
    display: flex;
    flex-direction: column;
    font-size: 14px;

    .card-container {
		padding: 15px 5px;
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

	.download-button {
        display: flex;
        align-items: center;
        padding: 10px 12px;
		height: 30px;
        border: none;
		font-size: 10px;
        border-radius: 4px;
		background-color: ${colors.standard_dark_blue};
        /* background-color: linear-gradient(45deg, #36589b, ${colors.standard_dark_blue});*/
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
        font-size: 48px;
		color: ${colors.standard_dark_blue};
        font-weight: 900;
        text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.2);
		margin: 0 0 10px 0;
    }
`;


export {
	LayoutContainer,
	StyledContainer,
	StyledTopBar,

}