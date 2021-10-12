package br.com.fernando.crud.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import br.com.fernando.crud.model.Employee;

@Repository
public interface EmployeeRepository extends MongoRepository<Employee, Long>{

}
