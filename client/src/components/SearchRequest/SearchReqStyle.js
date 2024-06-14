import styled from 'styled-components';

export const SearchReqWrapper = styled.div`
    display: flex;
    width: 50%;
    margin-bottom: 10px;
    @media only screen and (max-width: 1000px) {
        display: flex;
        width: 100%;
        flex-direction: column;
        margin-bottom: 10px;
    }
`;

export const FilterBox = styled.div`
	width: 250px;
	display: flex;
	justify-content: center;
	@media (max-width: 1000px) {
		width: 100%;
	}
	.filter {
		width: 250px;
		height: 100%;
		color: #3D405A;
		background-color: rgba(255, 255, 255, 0.8);
		font-size: 12px;
		padding-top: 5px;
		padding-left: 20px;
		padding-right: 20px;
		padding-bottom: 20px;
		border-radius: 10px;
		.form-field {
			margin-bottom: 20px;
		}
        
		@media only screen and (max-width: 1000px) {
			width: 660px;
			font-size: 12px;
			padding-bottom: 5px;
			margin-bottom: 10px;
		}
		@media (max-width: 700px) {
			width: 400px;
		}
	}
`;

export const MainPanel = styled.div`
    width: 100%;
    margin-left: 20px;
    @media only screen and (max-width: 1000px) {
        display: flex;
        font-size: 12px;
        flex-direction: column;
        align-items: center;
        padding-bottom: 5px;
        max-width: 100%;
        margin-bottom: 10px;
        margin-left: 0;
    }
`;

export const SearchReqPanel = styled.div`
    display: flex;
    justify-content: space-between;
    max-width: 100%;
    border-radius: 10px;
    padding-left: 30px;
    padding-right: 30px;
    padding-bottom: 30px;
    color: #3D405A;
    background-color: rgba(255, 255, 255, 0.8);
    @media only screen and (max-width: 1000px) {
        display: flex;
        flex-direction: column;
        max-width: 100%;
        font-size: 12px;
        align-items: center;
    }
`;