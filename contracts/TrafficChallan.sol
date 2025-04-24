//  // SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract TrafficChallan {
    uint256 public challanCount = 0;

    struct Challan {
        uint256 challanId;
        string vehicleNumber;
        string offense;
        uint256 fineAmount;
        string date;
        string time;
    }

    mapping(uint256 => Challan) public challans;

    event ChallanGenerated(uint256 challanId);

    function generateChallan(
        string memory _vehicleNumber,
        string memory _offense,
        uint256 _fineAmount,
        string memory _date,
        string memory _time
    ) public {
        challanCount++;
        challans[challanCount] = Challan(challanCount, _vehicleNumber, _offense, _fineAmount, _date, _time);
        emit ChallanGenerated(challanCount);
    }

    function getChallan(uint256 _challanId) public view returns (
        string memory vehicleNumber,
        string memory offense,
        uint256 fineAmount,
        string memory date,
        string memory time
    ) {
        Challan memory c = challans[_challanId];
        return (c.vehicleNumber, c.offense, c.fineAmount, c.date, c.time);
    }
}
