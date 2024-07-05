package com.opencbs.core.request.serivce;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencbs.core.domain.Role;
import com.opencbs.core.domain.json.ExtraJson;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.RoleDetailsForSaveDto;
import com.opencbs.core.mappers.RoleMapper;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.interfaces.BaseRequestDto;
import com.opencbs.core.request.interfaces.RequestHandler;
import com.opencbs.core.services.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@RequiredArgsConstructor
@Service
public class RequestCreateRoleHandler implements RequestHandler {

    private final ObjectMapper mapper;
    private final RoleMapper roleMapper;
    private final RoleService roleService;

    @Override
    public RequestType getRequestType() {
        return RequestType.ROLE_CREATE;
    }

    @Override
    public ExtraJson getContent(BaseDto dto) throws IOException {
        RoleDetailsForSaveDto detailsForSaveDto = (RoleDetailsForSaveDto) dto;
        ExtraJson result = new ExtraJson();
        result.put("value", this.mapper.writeValueAsString(detailsForSaveDto));
        return result;
    }

    @Override
    public Long approveRequest(Request request) throws IOException {
        Role role = this.roleService.create(this.createEntity(request));
        return role.getId();
    }

    @Override
    public BaseRequestDto handleContent(Request request) throws IOException {
        return this.roleMapper.mapToDetailsDtoForRole(createEntity(request));
    }

    private Role createEntity(Request request) throws IOException {
        RoleDetailsForSaveDto dto = this.mapper.readValue(request.getContent().get("value").toString(), RoleDetailsForSaveDto.class);
        return this.roleMapper.mapToEntity(dto);
    }

    @Override
    public Class getTargetClass() {
        return Role.class;
    }
}
