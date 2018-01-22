import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { rgb } from 'd3-color';
const respondents = 95, //Total number of respondents (i.e. the number that makes up the group)
    emptyPerc = 0.4, //What % of the circle should become empty in comparison to the visible arcs
    emptyStroke = Math.round(respondents*emptyPerc); //How many "units" would define this empty percentage
const getAngle = (group) => ((group.startAngle + group.endAngle) / 2 + offset);
const offset = Math.PI * (emptyStroke/(respondents + emptyStroke)) / 2;
function startAngle(d) { return d.startAngle + offset; }
function endAngle(d) { return d.endAngle + offset; }
const Groups = ({
    componentId,
    chords,
    color,
    arc,
    outerRadius,
    setMouseOverGroup,
    groupLabels,
    labelColors,
    disableHover,
}) => (
    <g className="groups">
        {chords.groups.map((group, groupIndex) => (
            <g
                key={groupIndex}
                onMouseOver={!disableHover ? () => setMouseOverGroup(group.index) : null}
                onMouseOut={!disableHover ? () => setMouseOverGroup(null) : null}
            >
                <path
                    id={`component${componentId}-group${groupIndex}`}
                    fill={`${color(groupIndex)}`}
                    stroke={`${rgb(color(groupIndex)).darker()}`} d={arc(group)}
                />

                <text
                    dy=".35em"
                    transform={`rotate(${getAngle(group) * 180 / Math.PI - 90 }) translate(${outerRadius + 10}) ${getAngle(group) > Math.PI ? "rotate(180)" : ""}`}
                    fill={labelColors.length === 1 ? labelColors[0] : labelColors[groupIndex]}
                    style={{textAnchor: (group.startAngle + group.endAngle) / 2 > Math.PI ? "end" : null}}
                >
                    {groupLabels[groupIndex]}
                </text>
            </g>
        ))}
    </g>
);

Groups.propTypes = {
    componentId: PropTypes.number.isRequired,
    chords: PropTypes.array.isRequired,
    color: PropTypes.func.isRequired,
    arc: PropTypes.func.isRequired,
    setMouseOverGroup: PropTypes.func.isRequired,
    groupLabels: PropTypes.array,
    labelColors: PropTypes.array,
    disableHover: PropTypes.bool,
};

export default Groups;