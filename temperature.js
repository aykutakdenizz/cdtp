let temperature = new Array(20);

exports.getTemperature = (index) => {
    return temperature[index];
};

exports.setTemperature = (index, temp) => {
    temperature[index] = temp;
};

