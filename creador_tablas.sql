USE Parking;

CREATE TABLE Vehiculo (
    ID_Vehiculo INT PRIMARY KEY AUTO_INCREMENT,
    Matricula VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE PlazaEstacionamiento (
    ID_Plaza INT PRIMARY KEY AUTO_INCREMENT,
    Disponible BOOLEAN DEFAULT TRUE,
    ID_Vehiculo INT,
    CONSTRAINT FK_Plaza_Vehiculo FOREIGN KEY (ID_Vehiculo) REFERENCES Vehiculo (ID_Vehiculo)
);

CREATE TABLE TransaccionEstacionamiento (
    ID_Transaccion INT PRIMARY KEY AUTO_INCREMENT,
    ID_Vehiculo INT NOT NULL,
    ID_Plaza INT NOT NULL,
    FechaHoraInicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FechaHoraFin DATETIME,
    MontoPagado DECIMAL(10, 2),
    CONSTRAINT FK_Transaccion_Vehiculo FOREIGN KEY (ID_Vehiculo) REFERENCES Vehiculo (ID_Vehiculo),
    CONSTRAINT FK_Transaccion_Plaza FOREIGN KEY (ID_Plaza) REFERENCES PlazaEstacionamiento (ID_Plaza)
);

-- Insertar 20 registros en PlazaEstacionamiento con ID_Vehiculo como NULL
INSERT INTO PlazaEstacionamiento (Disponible, ID_Vehiculo)
SELECT TRUE, NULL
FROM information_schema.tables
LIMIT 20;


DROP TABLE Vehiculo;
DROP TABLE PlazaEstacionamiento;
DROP TABLE TransaccionEstacionamiento;
