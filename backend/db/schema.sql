-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `dcim` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `dcim`;

CREATE TABLE IF NOT EXISTS `dcim`.`vendors` (
  `vendor_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `support_url` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`vendor_id`),
  UNIQUE INDEX `name` (`name` ASC) VISIBLE
) ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `dcim`.`device_models` (
  `model_id` INT NOT NULL AUTO_INCREMENT,
  `vendor_id` INT NOT NULL,
  `model_name` VARCHAR(120) NOT NULL,
  `device_type` ENUM('server', 'switch', 'router', 'firewall', 'storage', 'ups', 'pdu', 'other') NOT NULL DEFAULT 'other',
  `u_height` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`model_id`),
  UNIQUE INDEX `vendor_id` (`vendor_id` ASC, `model_name` ASC) VISIBLE,
  CONSTRAINT `fk_models_vendors`
    FOREIGN KEY (`vendor_id`)
    REFERENCES `dcim`.`vendors` (`vendor_id`)
) ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `dcim`.`sites` (
  `site_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NULL DEFAULT NULL,
  `address` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`site_id`),
  UNIQUE INDEX `name` (`name` ASC) VISIBLE
) ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `dcim`.`rooms` (
  `room_id` INT NOT NULL AUTO_INCREMENT,
  `site_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `floor` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`room_id`),
  UNIQUE INDEX `site_id` (`site_id` ASC, `name` ASC) VISIBLE,
  CONSTRAINT `fk_rooms_sites`
    FOREIGN KEY (`site_id`)
    REFERENCES `dcim`.`sites` (`site_id`)
) ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `dcim`.`racks` (
  `rack_id` INT NOT NULL AUTO_INCREMENT,
  `room_id` INT NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `total_u` INT NOT NULL DEFAULT 42,
  PRIMARY KEY (`rack_id`),
  UNIQUE INDEX `room_id` (`room_id` ASC, `code` ASC) VISIBLE,
  CONSTRAINT `fk_racks_rooms`
    FOREIGN KEY (`room_id`)
    REFERENCES `dcim`.`rooms` (`room_id`)
) ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `dcim`.`devices` (
  `device_id` INT NOT NULL AUTO_INCREMENT,
  `model_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `asset_tag` VARCHAR(100) NULL DEFAULT NULL,
  `serial_number` VARCHAR(100) NULL DEFAULT NULL,
  `rack_id` INT NULL DEFAULT NULL,
  `u_start` INT NULL DEFAULT NULL,
  `status` ENUM('active', 'maintenance', 'retired') NOT NULL DEFAULT 'active',
  `installed_at` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`device_id`),
  UNIQUE INDEX `asset_tag` (`asset_tag` ASC) VISIBLE,
  UNIQUE INDEX `serial_number` (`serial_number` ASC) VISIBLE,
  INDEX `fk_devices_models` (`model_id` ASC) VISIBLE,
  INDEX `fk_devices_racks` (`rack_id` ASC) VISIBLE,
  CONSTRAINT `fk_devices_models`
    FOREIGN KEY (`model_id`)
    REFERENCES `dcim`.`device_models` (`model_id`),
  CONSTRAINT `fk_devices_racks`
    FOREIGN KEY (`rack_id`)
    REFERENCES `dcim`.`racks` (`rack_id`)
) ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `dcim`.`rack_unit_occupancy` (
  `rack_id` INT NOT NULL,
  `unit` INT NOT NULL,
  `device_id` INT NOT NULL,
  PRIMARY KEY (`rack_id`, `unit`),
  INDEX `idx_occupancy_device` (`device_id` ASC) VISIBLE,
  CONSTRAINT `fk_occupancy_device`
    FOREIGN KEY (`device_id`)
    REFERENCES `dcim`.`devices` (`device_id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_occupancy_rack`
    FOREIGN KEY (`rack_id`)
    REFERENCES `dcim`.`racks` (`rack_id`)
    ON DELETE CASCADE
) ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `dcim`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `username` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email` (`email` ASC) VISIBLE
) ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
