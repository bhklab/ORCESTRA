CREATE DATABASE orcestra_dev;

USE orcestra_dev;

CREATE TABLE dataset (
    dataset_id INT AUTO_INCREMENT,
    dataset_name  VARCHAR(255) NOT NULL,
    dataset_version VARCHAR(255) NOT NULL,
    PRIMARY KEY(dataset_id)
);

CREATE TABLE drug_sensitivity (
    sensitivity_id INT AUTO_INCREMENT,
    year_published VARCHAR(255) NOT NULL,
    PRIMARY KEY(sensitivity_id)
);

CREATE TABLE metadata (
    metadata_id INT AUTO_INCREMENT,
    metadata VARCHAR(255),
    PRIMARY KEY(metadata_id)
);

CREATE TABLE rna_tool (
    rna_tool_id INT AUTO_INCREMENT,
    rna_tool_name VARCHAR(255) NOT NULL,
    rna_tool_version VARCHAR(255),
    PRIMARY KEY(rna_tool_id)
);

CREATE TABLE rna_ref (
    rna_ref_id INT AUTO_INCREMENT,
    rna_ref_name VARCHAR(255) NOT NULL,
    rna_ref_version VARCHAR(255),
    PRIMARY KEY(rna_ref_id)
);

CREATE TABLE exome_tool (
    exome_tool_id INT AUTO_INCREMENT,
    exome_tool_name VARCHAR(255) NOT NULL,
    exome_tool_version VARCHAR(255),
    PRIMARY KEY(exome_tool_id)
);

CREATE TABLE exome_ref (
    exome_ref_id INT AUTO_INCREMENT,
    exome_ref_name VARCHAR(255) NOT NULL,
    exome_ref_version VARCHAR(255),
    PRIMARY KEY(exome_ref_id)
);

CREATE TABLE mutation_tool (
    mutation_tool_id INT AUTO_INCREMENT,
    mutation_tool_name VARCHAR(255) NOT NULL,
    mutation_tool_version VARCHAR(255),
    PRIMARY KEY(mutation_tool_id)
);

CREATE TABLE pset (
    pset_id INT AUTO_INCREMENT,
    doi VARCHAR(255) NOT NULL,
    dataset_id INT,
    sensitivity_id INT,
    metadata_id INT,
    PRIMARY KEY(pset_id),
    FOREIGN KEY(dataset_id) REFERENCES dataset(dataset_id) ON DELETE CASCADE,
    FOREIGN KEY(sensitivity_id) REFERENCES drug_sensitivity(sensitivity_id) ON DELETE CASCADE,
    FOREIGN KEY(metadata_id) REFERENCES metadata(metadata_id) ON DELETE CASCADE
);

CREATE TABLE pset_rna_tool (
    pset_id INT,
    rna_tool_id INT,
    PRIMARY KEY(pset_id, rna_tool_id),
    FOREIGN KEY(pset_id) REFERENCES pset(pset_id) ON DELETE CASCADE,
    FOREIGN KEY(rna_tool_id) REFERENCES rna_tool(rna_tool_id) ON DELETE CASCADE
);

CREATE TABLE pset_rna_ref (
    pset_id INT,
    rna_ref_id INT,
    PRIMARY KEY(pset_id, rna_ref_id),
    FOREIGN KEY(pset_id) REFERENCES pset(pset_id) ON DELETE CASCADE,
    FOREIGN KEY(rna_ref_id) REFERENCES rna_ref(rna_ref_id) ON DELETE CASCADE
);

CREATE TABLE pset_exome_tool (
    pset_id INT,
    exome_tool_id INT,
    PRIMARY KEY(pset_id, exome_tool_id),
    FOREIGN KEY(pset_id) REFERENCES pset(pset_id) ON DELETE CASCADE,
    FOREIGN KEY(exome_tool_id) REFERENCES exome_tool(exome_tool_id) ON DELETE CASCADE
);

CREATE TABLE pset_exome_ref (
    pset_id INT,
    exome_ref_id INT,
    PRIMARY KEY(pset_id, exome_ref_id),
    FOREIGN KEY(pset_id) REFERENCES pset(pset_id) ON DELETE CASCADE,
    FOREIGN KEY(exome_ref_id) REFERENCES exome_ref(exome_ref_id) ON DELETE CASCADE
);

CREATE TABLE pset_mutation_tool (
    pset_id INT,
    mutation_tool_id INT,
    PRIMARY KEY(pset_id, mutation_tool_id),
    FOREIGN KEY(pset_id) REFERENCES pset(pset_id) ON DELETE CASCADE,
    FOREIGN KEY(mutation_tool_id) REFERENCES mutation_tool(mutation_tool_id) ON DELETE CASCADE
);

INSERT INTO metadata (metadata) VALUES('962dfb13788');
INSERT INTO metadata (metadata) VALUES('a7262839a32');

INSERT INTO dataset (dataset_name, dataset_version) VALUES('Leuk AML', '0.0.0');
INSERT INTO dataset (dataset_name, dataset_version) VALUES('GRAY', '0.0.0');

INSERT INTO drug_sensitivity (year_published) VALUES(2019);
INSERT INTO drug_sensitivity (year_published) VALUES(2017);

INSERT INTO rna_tool (rna_tool_name, rna_tool_version) VALUES('STAR', NULL);
INSERT INTO rna_tool (rna_tool_name, rna_tool_version) VALUES('Kallisto', '0.44.1');

INSERT INTO rna_ref (rna_ref_name, rna_ref_version) VALUES('GRCh38', NULL);
INSERT INTO rna_ref (rna_ref_name, rna_ref_version) VALUES('Ensembl', 'v82');
INSERT INTO rna_ref (rna_ref_name, rna_ref_version) VALUES('GRCh37', NULL);

INSERT INTO exome_tool (exome_tool_name, exome_tool_version) VALUES('BWA', '0.6.2');
INSERT INTO exome_tool (exome_tool_name, exome_tool_version) VALUES('VarScan', '2.3.2');
INSERT INTO exome_tool (exome_tool_name, exome_tool_version) VALUES('SNPEff', '4.0');
INSERT INTO exome_tool (exome_tool_name, exome_tool_version) VALUES('MuTect1', NULL);

INSERT INTO exome_ref (exome_ref_name, exome_ref_version) VALUES('GRCh37', NULL);
INSERT INTO exome_ref (exome_ref_name, exome_ref_version) VALUES('Ensembl', 'v68');

INSERT INTO mutation_tool (mutation_tool_name, mutation_tool_version) VALUES('MuTect1', NULL);
INSERT INTO mutation_tool (mutation_tool_name, mutation_tool_version) VALUES('MuTect2', NULL);

INSERT INTO pset (doi, dataset_id, sensitivity_id, metadata_id) VALUES('{doi: 106084m9figshare8127281}', 1, 1, 1);
INSERT INTO pset (doi, dataset_id, sensitivity_id, metadata_id) VALUES('{doi: 106334m9figshare8997281}', 2, 2, 2);

INSERT INTO pset_rna_tool(pset_id, rna_tool_id) VALUES(1, 1);
INSERT INTO pset_rna_tool(pset_id, rna_tool_id) VALUES(2, 2);

INSERT INTO pset_rna_ref(pset_id, rna_ref_id) VALUES(1, 1);
INSERT INTO pset_rna_ref(pset_id, rna_ref_id) VALUES(1, 2);
INSERT INTO pset_rna_ref(pset_id, rna_ref_id) VALUES(2, 2);

INSERT INTO pset_exome_tool(pset_id, exome_tool_id) VALUES(1, 1);
INSERT INTO pset_exome_tool(pset_id, exome_tool_id) VALUES(1, 2);
INSERT INTO pset_exome_tool(pset_id, exome_tool_id) VALUES(1, 3);
INSERT INTO pset_exome_tool(pset_id, exome_tool_id) VALUES(2, 4);

INSERT INTO pset_exome_ref(pset_id, exome_ref_id) VALUES(1, 1);
INSERT INTO pset_exome_ref(pset_id, exome_ref_id) VALUES(1, 2);
INSERT INTO pset_exome_ref(pset_id, exome_ref_id) VALUES(2, 1);
INSERT INTO pset_exome_ref(pset_id, exome_ref_id) VALUES(2, 2);

INSERT INTO pset_mutation_tool(pset_id, mutation_tool_id) VALUES(1, 1);
INSERT INTO pset_mutation_tool(pset_id, mutation_tool_id) VALUES(2, 2);
