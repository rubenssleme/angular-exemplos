package br.com.fernando.crud.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.fernando.crud.controller.exception.ResourceNotFoundException;
import br.com.fernando.crud.model.Employee;
import br.com.fernando.crud.repository.EmployeeRepository;
import br.com.fernando.crud.service.SequenceGeneratorService;
import io.swagger.annotations.ApiOperation;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1")
public class EmployeeController {

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private SequenceGeneratorService sequenceGeneratorService;

	@ApiOperation(value = "Exibe todos os Funcionario")
	@GetMapping("/employees")
	public List<Employee> getAllEmployees() {
		return employeeRepository.findAll();
	}

	@ApiOperation(value = "Busca por id")
	@GetMapping("/employees/{id}")
	public ResponseEntity<Employee> getEmployeeById(@PathVariable(value = "id") Long employeeId)
			throws ResourceNotFoundException {
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new ResourceNotFoundException("Employee não encontrado com o  id: " + employeeId));
		return ResponseEntity.ok().body(employee);
	}

	@ApiOperation(value = "Insere Funcionario")
	@PostMapping("/employees")
	public Employee createEmployee(@Valid @RequestBody Employee employee) {
		employee.setId(sequenceGeneratorService.generateSequence(Employee.SEQUENCE_NAME));
		return employeeRepository.save(employee);
	}

	@ApiOperation(value = "Altera Funcionario por id")
	@PutMapping("/employees/{id}")
	public ResponseEntity<Employee> updateEmployee(@PathVariable(value = "id") Long employeeId,
			@Valid @RequestBody Employee employeeDetails) throws ResourceNotFoundException {
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new ResourceNotFoundException("Employee não encontrado com o  id: " + employeeId));

		employee.setEmailId(employeeDetails.getEmailId());
		employee.setLastName(employeeDetails.getLastName());
		employee.setFirstName(employeeDetails.getFirstName());
		final Employee updatedEmployee = employeeRepository.save(employee);
		return ResponseEntity.ok(updatedEmployee);
	}

	@ApiOperation(value = "Exclui Funcionario por id")
	@DeleteMapping("/employees/{id}")
	public Map<String, Boolean> deleteEmployee(@PathVariable(value = "id") Long employeeId)
			throws ResourceNotFoundException {
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new ResourceNotFoundException("Employee não encontrado com o  id: " + employeeId));

		employeeRepository.delete(employee);
		Map<String, Boolean> response = new HashMap<>();
		response.put("Excluido com sucesso", Boolean.TRUE);
		return response;
	}
}
